"""
LeafCare-AI Model Training & Fine-Tuning Pipeline
------------------------------------------------
This script allows you to train an expanded deep-learning model on new crops
(such as Rice, Wheat, Cotton, Sugarcane, Mango, Cassava, etc.) using MobileNetV3
or EfficientNet transfer learning, and export it directly to TensorFlow.js.

Usage:
    python train_and_export.py --data_dir /path/to/dataset --epochs 15 --export_dir ./new_tfjs_model
"""

import os
import json
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models

def build_model(num_classes: int, input_shape=(128, 128, 3)):
    """
    Constructs an EfficientNetB0 or MobileNetV3 backbone optimized for web deployment.
    """
    base_model = tf.keras.applications.MobileNetV3Small(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    # Freeze initial base layers
    base_model.trainable = False

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_and_export(data_dir: str, export_dir: str, epochs: int = 15, batch_size: int = 32):
    print(f"[*] Loading training data from: {data_dir}")
    
    # Image dataset loader with automatic train/val split
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=1337,
        image_size=(128, 128),
        batch_size=batch_size
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=1337,
        image_size=(128, 128),
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"[*] Discovered {num_classes} classes: {class_names}")

    # Optimize pipeline performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # Build model
    model = build_model(num_classes=num_classes)
    model.summary()

    # Train top head
    print(f"[*] Training top classification layers for {epochs} epochs...")
    model.fit(train_ds, validation_data=val_ds, epochs=epochs)

    # Fine-tuning: unfreeze the top layers of MobileNetV3
    print("[*] Fine-tuning upper layers...")
    base_model = model.layers[0]
    base_model.trainable = True
    # Freeze all except top 20 layers
    for layer in base_model.layers[:-20]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    model.fit(train_ds, validation_data=val_ds, epochs=max(3, epochs // 3))

    # Save Keras Model
    os.makedirs(export_dir, exist_ok=True)
    keras_path = os.path.join(export_dir, "saved_model.keras")
    model.save(keras_path)
    print(f"[+] Saved trained Keras model to: {keras_path}")

    # Save class_names.json
    class_names_path = os.path.join(export_dir, "class_names.json")
    with open(class_names_path, "w") as f:
        json.dump(class_names, f, indent=4)
    print(f"[+] Saved class names dictionary to: {class_names_path}")

    # Export to TensorFlow.js format
    print("[*] Converting model to TensorFlow.js web shards...")
    try:
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(model, export_dir)
        print(f"[✓] Successfully exported TFJS model shards to: {export_dir}")
    except ImportError:
        print("[!] tensorflowjs package is not installed. To convert:")
        print(f"    pip install tensorflowjs")
        print(f"    tensorflowjs_converter --input_format=keras {keras_path} {export_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train and export expanded crop disease model.")
    parser.add_argument("--data_dir", type=str, required=True, help="Directory containing class subfolders of leaf images.")
    parser.add_argument("--export_dir", type=str, default="./new_tfjs_model", help="Directory where model and class names will be saved.")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs.")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size for training.")
    args = parser.parse_args()

    train_and_export(args.data_dir, args.export_dir, args.epochs, args.batch_size)
