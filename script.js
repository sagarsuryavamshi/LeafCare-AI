
// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");
const resultCard = document.getElementById("resultCard");


// ==========================================
// 2. LOAD TENSORFLOW.JS MODEL
// ==========================================

let model;
let classNames;

async function loadModel() {
    try {
        result.textContent = "Loading AI model...";

        model = await tf.loadLayersModel("./tfjs_model/model.json");

        const response = await fetch("./tfjs_model/class_names.json");

        if (!response.ok) {
            throw new Error("Could not load class names.");
        }

        classNames = await response.json();

        if (classNames.length !== 38) {
            throw new Error("Expected 38 classes, but found " + classNames.length);
        }

        result.textContent = "AI model loaded successfully!";

        console.log("CNN model loaded successfully!");
        console.log("Number of classes:", classNames.length);

    } catch (error) {
        result.textContent = "Model loading error: " + error.message;
        console.error(error);
    }
}

loadModel();


// ==========================================
// 3. DISEASE INFORMATION DATABASE
// ==========================================

const diseaseInfo = {

    // TOMATO

    "Tomato___Leaf_Mold": {
        description: "Tomato Leaf Mold is a fungal disease that commonly affects tomato leaves, especially in humid environments.",
        symptoms: "Yellow patches on the upper leaf surface and olive-green to brown fungal growth on the underside.",
        treatment: "Remove severely infected leaves, improve ventilation and avoid overhead watering. Use a locally approved fungicide if necessary, following its label.",
        prevention: "Maintain proper spacing, improve air circulation, avoid excessive humidity and remove infected plant debris."
    },

    "Tomato___Bacterial_spot": {
        description: "Bacterial Spot is a bacterial disease affecting tomato leaves, stems and fruits.",
        symptoms: "Small dark, water-soaked spots on leaves and raised spots on fruits.",
        treatment: "Remove severely infected plant parts and seek local agricultural advice about suitable treatments.",
        prevention: "Use healthy seeds, maintain proper spacing and avoid overhead watering."
    },

    "Tomato___Early_blight": {
        description: "Early Blight is a fungal disease commonly affecting tomato leaves.",
        symptoms: "Brown circular spots with concentric rings, often surrounded by yellow areas.",
        treatment: "Remove infected leaves and seek local agricultural advice about suitable fungicides.",
        prevention: "Rotate crops, maintain proper spacing and remove infected plant debris."
    },

    "Tomato___Late_blight": {
        description: "Late Blight is a serious disease that can spread rapidly in tomato plants.",
        symptoms: "Dark, water-soaked patches on leaves and stems, sometimes with white fungal growth underneath.",
        treatment: "Remove infected plant material and seek prompt local agricultural advice about disease management.",
        prevention: "Use healthy planting material, improve air circulation and avoid prolonged leaf wetness."
    },

    "Tomato___Septoria_leaf_spot": {
        description: "Septoria Leaf Spot is a fungal disease affecting tomato leaves.",
        symptoms: "Small circular spots with gray or tan centers and dark edges.",
        treatment: "Remove infected lower leaves and seek local agricultural advice about suitable fungicides.",
        prevention: "Rotate crops, remove infected debris and avoid watering leaves."
    },

    "Tomato___Spider_mites Two-spotted_spider_mite": {
        description: "Spider Mites are tiny pests that feed on tomato leaves.",
        symptoms: "Tiny yellow or white speckles, leaf discoloration and fine webbing on leaves.",
        treatment: "Remove heavily infested leaves and seek local agricultural advice about suitable mite control.",
        prevention: "Monitor leaves regularly, control weeds and maintain proper plant care."
    },

    "Tomato___Target_Spot": {
        description: "Target Spot is a fungal disease affecting tomato leaves, stems and fruits.",
        symptoms: "Brown circular lesions with concentric rings resembling a target.",
        treatment: "Remove infected leaves and seek local agricultural advice about appropriate disease management.",
        prevention: "Improve air circulation, avoid overhead watering and remove infected plant debris."
    },

    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        description: "Tomato Yellow Leaf Curl Virus is a viral disease commonly transmitted by whiteflies.",
        symptoms: "Yellowing and upward curling of leaves, stunted growth and reduced fruit production.",
        treatment: "There is no direct cure for infected plants. Remove severely infected plants and seek local agricultural advice.",
        prevention: "Use healthy seedlings, manage whiteflies and remove infected plants."
    },

    "Tomato___Tomato_mosaic_virus": {
        description: "Tomato Mosaic Virus is a viral disease affecting tomato plants.",
        symptoms: "Mosaic-like light and dark green patterns, leaf distortion and stunted growth.",
        treatment: "There is no direct cure. Remove infected plants and sanitize tools.",
        prevention: "Use virus-free seeds, disinfect gardening tools and avoid handling healthy plants after infected ones."
    },

    "Tomato___healthy": {
        description: "The tomato leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, balanced nutrition and regular plant monitoring."
    },


    // APPLE

    "Apple___Apple_scab": {
        description: "Apple Scab is a fungal disease that affects apple leaves and fruits.",
        symptoms: "Dark olive-green or black spots on leaves and scabby patches on fruits.",
        treatment: "Remove infected leaves and fruits. Seek local agricultural advice about suitable fungicides.",
        prevention: "Remove fallen leaves and maintain good air circulation."
    },

    "Apple___Black_rot": {
        description: "Black Rot is a fungal disease affecting apple leaves, branches and fruits.",
        symptoms: "Brown leaf spots, rotting fruits and dead branches.",
        treatment: "Remove infected fruits and branches. Seek advice about appropriate fungicide use.",
        prevention: "Prune dead branches and remove infected plant debris."
    },

    "Apple___Cedar_apple_rust": {
        description: "Cedar Apple Rust is a fungal disease affecting apple trees.",
        symptoms: "Bright orange or yellow spots on leaves, sometimes with raised structures underneath.",
        treatment: "Remove heavily infected plant material and seek local agricultural advice.",
        prevention: "Remove nearby cedar or juniper infection sources where practical."
    },

    "Apple___healthy": {
        description: "The apple leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Continue regular watering, pruning and plant monitoring."
    },


    // BLUEBERRY

    "Blueberry___healthy": {
        description: "The blueberry leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, pruning and regular plant monitoring."
    },


    // CHERRY

    "Cherry_(including_sour)___Powdery_mildew": {
        description: "Powdery Mildew is a fungal disease that affects cherry leaves and shoots.",
        symptoms: "White powdery fungal growth on leaves and shoots, sometimes causing leaf curling.",
        treatment: "Remove severely affected plant parts and seek local agricultural advice about suitable fungicides.",
        prevention: "Improve air circulation, avoid excessive nitrogen fertilization and monitor plants regularly."
    },

    "Cherry_(including_sour)___healthy": {
        description: "The cherry leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, pruning and regular plant monitoring."
    },


    // CORN

    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        description: "Gray Leaf Spot is a fungal disease affecting corn leaves.",
        symptoms: "Long rectangular gray or tan lesions between leaf veins.",
        treatment: "Remove heavily infected crop debris and seek local agricultural advice about suitable disease management.",
        prevention: "Use resistant varieties, rotate crops and manage crop residue."
    },

    "Corn_(maize)___Common_rust_": {
        description: "Common Rust is a fungal disease affecting corn leaves.",
        symptoms: "Small reddish-brown raised pustules scattered across leaf surfaces.",
        treatment: "Monitor disease severity and seek local agricultural advice about suitable fungicides if needed.",
        prevention: "Grow resistant varieties and monitor crops regularly."
    },

    "Corn_(maize)___Northern_Leaf_Blight": {
        description: "Northern Leaf Blight is a fungal disease affecting corn leaves.",
        symptoms: "Long, cigar-shaped gray-green or tan lesions on leaves.",
        treatment: "Remove infected crop residue where practical and seek local agricultural advice.",
        prevention: "Use resistant varieties, rotate crops and maintain good field hygiene."
    },

    "Corn_(maize)___healthy": {
        description: "The corn leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper irrigation, crop nutrition and regular monitoring."
    },


    // GRAPE

    "Grape___Black_rot": {
        description: "Black Rot is a fungal disease that affects grape leaves, shoots and fruits.",
        symptoms: "Brown circular spots on leaves and dark, shriveled berries.",
        treatment: "Remove infected grape clusters and plant debris. Seek local agricultural advice about suitable fungicides.",
        prevention: "Maintain good air circulation, prune vines properly and remove infected plant material."
    },

    "Grape___Esca_(Black_Measles)": {
        description: "Esca, also called Black Measles, is a complex grapevine disease.",
        symptoms: "Tiger-stripe patterns on leaves and dark spots on grape berries.",
        treatment: "Remove severely affected plant parts and consult a grapevine disease specialist.",
        prevention: "Use healthy planting material and protect pruning wounds using recommended practices."
    },

    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        description: "Grape Leaf Blight is a fungal disease affecting grape leaves.",
        symptoms: "Brown or reddish-brown spots that may spread across leaf surfaces.",
        treatment: "Remove severely infected leaves and seek local agricultural advice about disease management.",
        prevention: "Improve air circulation, manage vineyard moisture and remove infected leaves."
    },

    "Grape___healthy": {
        description: "The grape leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper pruning, irrigation and regular vineyard monitoring."
    },


    // ORANGE

    "Orange___Haunglongbing_(Citrus_greening)": {
        description: "Citrus Greening, also known as Huanglongbing (HLB), is a serious disease affecting citrus trees.",
        symptoms: "Blotchy yellow leaf patterns, yellow shoots and small, misshapen or unevenly colored fruits.",
        treatment: "There is no established cure for infected trees. Consult local agricultural authorities about diagnosis and management.",
        prevention: "Use certified disease-free planting material and manage citrus psyllid insects through locally recommended methods."
    },


    // PEACH

    "Peach___Bacterial_spot": {
        description: "Bacterial Spot is a disease affecting peach leaves and fruits.",
        symptoms: "Small dark spots on leaves, sometimes developing into holes, and lesions on fruits.",
        treatment: "Remove severely affected plant material and seek local agricultural advice about suitable disease management.",
        prevention: "Use healthy planting material and maintain good orchard hygiene."
    },

    "Peach___healthy": {
        description: "The peach leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, pruning and regular monitoring."
    },


    // PEPPER BELL

    "Pepper,_bell___Bacterial_spot": {
        description: "Bacterial Spot is a disease that affects pepper leaves and fruits.",
        symptoms: "Small dark, water-soaked spots on leaves and raised spots on fruits.",
        treatment: "Remove severely infected plant parts. Avoid overhead watering and seek local agricultural advice about suitable treatments.",
        prevention: "Use healthy seeds, maintain proper spacing and avoid working with plants when they are wet."
    },

    "Pepper,_bell___healthy": {
        description: "The pepper leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Continue proper watering, provide adequate sunlight and monitor the plant regularly."
    },


    // POTATO

    "Potato___Early_blight": {
        description: "Early Blight is a fungal disease that commonly affects potato leaves.",
        symptoms: "Brown circular spots with concentric rings, often surrounded by yellow areas.",
        treatment: "Remove severely affected leaves and seek local agricultural advice about suitable fungicides.",
        prevention: "Rotate crops, maintain proper plant spacing and remove infected crop debris."
    },

    "Potato___Late_blight": {
        description: "Late Blight is a serious disease that affects potato leaves and tubers.",
        symptoms: "Dark, water-soaked leaf patches that can spread quickly, sometimes with pale fungal growth underneath.",
        treatment: "Remove infected plant material and seek immediate local agricultural advice about disease management.",
        prevention: "Use certified healthy seed potatoes, avoid prolonged leaf wetness and monitor crops regularly."
    },

    "Potato___healthy": {
        description: "The potato leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper irrigation, crop nutrition and regular monitoring."
    },


    // RASPBERRY

    "Raspberry___healthy": {
        description: "The raspberry leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, pruning and regular plant monitoring."
    },


    // SOYBEAN

    "Soybean___healthy": {
        description: "The soybean leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain balanced soil nutrition, proper irrigation and regular crop monitoring."
    },


    // SQUASH

    "Squash___Powdery_mildew": {
        description: "Powdery Mildew is a fungal disease that commonly affects squash leaves.",
        symptoms: "White powdery patches on leaf surfaces that may spread and cause leaves to yellow or dry.",
        treatment: "Remove severely affected leaves and seek local agricultural advice about suitable disease management.",
        prevention: "Provide adequate plant spacing, improve air circulation and avoid excessive leaf moisture."
    },


    // STRAWBERRY

    "Strawberry___Leaf_scorch": {
        description: "Leaf Scorch is a fungal disease that affects strawberry leaves.",
        symptoms: "Small dark purple or reddish spots that may develop into larger brown areas.",
        treatment: "Remove infected leaves and seek local agricultural advice about suitable disease management.",
        prevention: "Use healthy planting material, maintain good spacing and remove infected plant debris."
    },

    "Strawberry___healthy": {
        description: "The strawberry leaf appears healthy, with no disease detected by the model.",
        symptoms: "No typical disease symptoms detected.",
        treatment: "No disease treatment is indicated by this prediction.",
        prevention: "Maintain proper watering, good air circulation and regular plant monitoring."
    }

};


// ==========================================
// 4. CONVERT MODEL CLASS NAME INTO READABLE TEXT
// ==========================================

function formatName(name) {

    return name
        .replaceAll("___", " - ")
        .replaceAll("_", " ")
        .replaceAll("(", "")
        .replaceAll(")", "");

}


// ==========================================
// 5. EXTRACT PLANT NAME
// ==========================================

function getPlantName(disease) {

    return disease.split("___")[0]
        .replaceAll("_", " ")
        .replaceAll(",", "");

}


// ==========================================
// 6. SHOW UPLOADED IMAGE
// ==========================================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    result.textContent = "";
    resultCard.style.display = "none";

    if (file) {

        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

    } else {

        preview.style.display = "none";

    }

});


// ==========================================
// 7. PREDICT PLANT DISEASE
// ==========================================

predictBtn.addEventListener("click", async function () {

    const file = imageInput.files[0];

    if (!file) {

        result.textContent = "Please upload a plant leaf image first.";
        return;

    }

    if (!model || !classNames) {

        result.textContent = "AI model is still loading. Please wait.";
        return;

    }

    result.textContent = "Analyzing your plant image...";
    resultCard.style.display = "none";
    predictBtn.disabled = true;

    let imageTensor;
    let prediction;

    try {

        // Wait until image preview is ready
        await preview.decode();

        // Image preprocessing:
        // RGB -> 128x128 -> divide by 255 -> batch dimension

        imageTensor = tf.tidy(() => {

            return tf.browser.fromPixels(preview)
                .resizeBilinear([128, 128])
                .toFloat()
                .div(255.0)
                .expandDims(0);

        });

        // Run CNN prediction

        prediction = model.predict(imageTensor);

        const scores = await prediction.data();

        // Find highest prediction

        let maxIndex = 0;

        for (let i = 1; i < scores.length; i++) {

            if (scores[i] > scores[maxIndex]) {
                maxIndex = i;
            }

        }

        // Get predicted disease and confidence

        const disease = classNames[maxIndex];

        const confidence = (scores[maxIndex] * 100).toFixed(2);

        const plant = getPlantName(disease);

        const readableDisease = formatName(disease);

        // Find disease information

        // Handle differences in the original database names

        const diseaseAliases = {
            "Cherry___Powdery_mildew": "Cherry_(including_sour)___Powdery_mildew",
            "Cherry___healthy": "Cherry_(including_sour)___healthy",

            "Corn___Cercospora_leaf_spot Gray_leaf_spot":
                "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",

            "Corn___Common_rust": "Corn_(maize)___Common_rust_",

            "Corn___Northern_Leaf_Blight":
                "Corn_(maize)___Northern_Leaf_Blight",

            "Corn___healthy": "Corn_(maize)___healthy"
        };

        const info = diseaseInfo[disease] ||
            diseaseInfo[diseaseAliases[disease]];

        // Display plant name

        document.getElementById("plantName").textContent = plant;

        // Display disease name

        document.getElementById("diseaseName").textContent =
            readableDisease;

        // Display confidence

        document.getElementById("confidence").textContent =
            confidence + "%";

        // Display disease information

        if (info) {

            document.getElementById("description").textContent =
                info.description;

            document.getElementById("symptoms").textContent =
                info.symptoms;

            document.getElementById("treatment").textContent =
                info.treatment;

            document.getElementById("prevention").textContent =
                info.prevention;

        } else {

            document.getElementById("description").textContent =
                "The CNN model identified this disease category. Consult a reliable agricultural source for disease-specific details.";

            document.getElementById("symptoms").textContent =
                "Symptoms vary depending on the identified disease. Inspect the affected plant carefully.";

            document.getElementById("treatment").textContent =
                "Disease-specific treatment information has not yet been added. Consult a local agricultural expert before applying treatment.";

            document.getElementById("prevention").textContent =
                "Maintain good crop hygiene, monitor plants regularly and use healthy planting material.";

        }

        // Show successful result

        result.textContent = "Analysis completed successfully!";

        resultCard.style.display = "block";

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        console.log("Predicted class:", disease);
        console.log("Confidence:", confidence + "%");

    } catch (error) {

        result.textContent = "Error: " + error.message;

        console.error("Prediction error:", error);

    } finally {

        if (imageTensor) {
            imageTensor.dispose();
        }

        if (prediction) {
            prediction.dispose();
        }

        predictBtn.disabled = false;

    }

});
