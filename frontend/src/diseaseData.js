export const diseaseInfo = {
  // TOMATO
  "Tomato___Leaf_Mold": {
    crop: "Tomato",
    disease: "Leaf Mold",
    severity: "Medium",
    color: "amber",
    pathogen: "Passalora fulva (Fungus)",
    description: "Tomato Leaf Mold is a fungal disease that commonly affects tomato leaves, especially in warm, humid greenhouse or field environments with limited airflow.",
    symptoms: "Pale greenish-yellow patches on upper leaf surfaces; velvety olive-green to grayish-brown spore patches underneath. Older leaves drop early.",
    treatment: "Remove severely infected lower foliage to increase air passage. Apply copper-based bio-fungicides or approved sulfur sprays if progression continues.",
    prevention: "Space plants 45-60cm apart for aeration. Use drip irrigation instead of overhead watering. Maintain greenhouse humidity below 85%."
  },
  "Tomato___Bacterial_spot": {
    crop: "Tomato",
    disease: "Bacterial Spot",
    severity: "High",
    color: "rose",
    pathogen: "Xanthomonas spp. (Bacteria)",
    description: "A destructive bacterial disease targeting foliage, stems, and fruits, rapidly transmitted through splashing rain and wet handling.",
    symptoms: "Small (2-3mm) circular dark brown water-soaked specks with yellow halos. Leaves eventually turn yellow, wither, and drop. Fruit develops scabby raised lesions.",
    treatment: "Immediately prune heavily infected plant segments. Apply preventative fixed copper sprays combined with mancozeb as per agricultural directives.",
    prevention: "Strictly avoid touching wet plants. Use certified pathogen-free seeds, practice 2-year crop rotation without solanaceous crops, and sanitize gardening tools."
  },
  "Tomato___Early_blight": {
    crop: "Tomato",
    disease: "Early Blight",
    severity: "High",
    color: "rose",
    pathogen: "Alternaria solani (Fungus)",
    description: "A very prevalent fungal disease causing extensive defoliation, beginning on lowest foliage and progressing upwards in warm, rainy weather.",
    symptoms: "Distinct target-board concentric dark rings surrounded by bright yellow halos. Lower leaves yellow and collapse prematurely.",
    treatment: "Clip off infected bottom leaves. Treat with bio-fungicides (Bacillus subtilis) or copper hydroxide. Mulch soil surface to prevent soil splash.",
    prevention: "Practice 3-year crop rotation. Stake and trellis plants off the ground. Mulch with straw to create a barrier between soil microbes and lower leaves."
  },
  "Tomato___Late_blight": {
    crop: "Tomato",
    disease: "Late Blight",
    severity: "Critical",
    color: "rose",
    pathogen: "Phytophthora infestans (Oomycete)",
    description: "An aggressive water mold capable of destroying entire crops in days under cool, wet, humid conditions.",
    symptoms: "Large, irregular water-soaked greasy olive-green to dark brown patches on foliage. White fluffy spore margins appear on leaf undersides in high humidity.",
    treatment: "Promptly remove and destroy infected vines in sealed bags (do not compost). Apply systemic oomycete-targeted fungicide immediately if localized.",
    prevention: "Select late-blight resistant cultivars. Avoid planting near potato crops. Provide excellent drainage and air exposure."
  },
  "Tomato___Septoria_leaf_spot": {
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    severity: "Medium",
    color: "amber",
    pathogen: "Septoria lycopersici (Fungus)",
    description: "Fungal pathogen producing abundant small spots starting near the base of the plant following warm, humid rainfall periods.",
    symptoms: "Abundant circular spots (1.5-3mm) with light gray or tan centers and dark brown margins. Tiny black specks (pycnidia) visible inside centers.",
    treatment: "Prune affected bottom leaves up to the first flower cluster. Apply organic copper spray every 7-10 days during persistent rain.",
    prevention: "Eliminate solanaceous weeds (nightshade, horsenettle). Clean up all plant debris at harvest. Mulch generously around stems."
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    crop: "Tomato",
    disease: "Two-Spotted Spider Mite",
    severity: "Medium",
    color: "amber",
    pathogen: "Tetranychus urticae (Arachnid Pest)",
    description: "Microscopic sap-sucking pests that proliferate rapidly in hot, dry, dusty microclimates, depleting chlorophyll.",
    symptoms: "Dense yellow stippling or bronzing on foliage surfaces; leaves feel brittle and dry. Fine silken webs visible across leaf axils and undersides.",
    treatment: "Spray leaf undersides thoroughly with cold insecticidal soap, neem oil (1-2%), or introduce predatory mites (Phytoseiulus persimilis).",
    prevention: "Keep plants well hydrated. Periodically rinse dust off foliage with water spray. Avoid excessive synthetic nitrogen fertilizers."
  },
  "Tomato___Target_Spot": {
    crop: "Tomato",
    disease: "Target Spot",
    severity: "Medium",
    color: "amber",
    pathogen: "Corynespora cassiicola (Fungus)",
    description: "Fungal disease favoring prolonged warmth (28-32°C) and relative humidity, often misidentified as early blight.",
    symptoms: "Pinpoint brown specks enlarging into circular lesions with concentric light and dark brown rings. Lesions may rupture or fall out creating shot-holes.",
    treatment: "Prune dense canopies to facilitate airflow. Apply protective fungicides such as chlorothalonil or copper formulations.",
    prevention: "Maintain weed-free perimeter. Space plants adequately. Avoid overhead sprinkler systems."
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    crop: "Tomato",
    disease: "Yellow Leaf Curl Virus (TYLCV)",
    severity: "Critical",
    color: "rose",
    pathogen: "Begomovirus (Vectored by Whiteflies)",
    description: "Devastating viral infection transmitted exclusively by silverleaf whiteflies (Bemisia tabaci).",
    symptoms: "Severe upward cupping and curling of leaves, bright interveinal yellowing, stunted bush-like growth, and widespread flower abortion.",
    treatment: "No direct chemical cure exists. Roguing (uprooting and destroying infected plants) is critical to prevent vector spread.",
    prevention: "Use TYLCV-resistant hybrids. Install 50-mesh insect netting in nursery beds. Deploy yellow sticky cards to monitor and suppress whiteflies."
  },
  "Tomato___Tomato_mosaic_virus": {
    crop: "Tomato",
    disease: "Tomato Mosaic Virus (ToMV)",
    severity: "High",
    color: "rose",
    pathogen: "Tobamovirus (Mechanically Transmitted)",
    description: "Extremely stable virus transmitted by mechanical friction, pruning shears, tobacco residue, and seed coats.",
    symptoms: "Mottled mosaic patterns of light and dark green on leaves, fern-like distorted leaf distortion (shoestring effect), and internal browning in fruit.",
    treatment: "Isolate and incinerate infected plants. Thoroughly sterilize tools in 10% trisodium phosphate (TSP) or 20% non-fat dry milk solution.",
    prevention: "Wash hands with soap before touching plants (especially tobacco users). Plant certified virus-indexed seeds."
  },
  "Tomato___healthy": {
    crop: "Tomato",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "Your tomato plant displays vigorous, healthy foliage without observable fungal or bacterial lesioning.",
    symptoms: "Lush green color, intact margins, well-developed veins, and normal turgor.",
    treatment: "No treatment necessary. Maintain standard feeding and watering regime.",
    prevention: "Keep maintaining steady moisture, balanced N-P-K fertilizer, and periodic leaf inspection."
  },

  // APPLE
  "Apple___Apple_scab": {
    crop: "Apple",
    disease: "Apple Scab",
    severity: "High",
    color: "rose",
    pathogen: "Venturia inaequalis (Fungus)",
    description: "One of the most destructive apple diseases worldwide, attacking foliage and young orchard fruits.",
    symptoms: "Velvety olive-green to dark brown circular spots with blurred margins on leaves. Leaves turn distorted, yellow, and drop prematurely.",
    treatment: "Apply bio-fungicides or potassium bicarbonate during early spring leaf emergence. Rake and compost fallen leaves to eliminate overwintering spores.",
    prevention: "Prune trees annually for maximum sunlight penetration. Plant resistant apple varieties (e.g., Liberty, Freedom, Enterprise)."
  },
  "Apple___Black_rot": {
    crop: "Apple",
    disease: "Black Rot / Frogeye Leaf Spot",
    severity: "High",
    color: "rose",
    pathogen: "Botryosphaeria obtusa (Fungus)",
    description: "Causes leaf spots (frogeye), limb cankers, and black mummified rot on developing fruit.",
    symptoms: "Small purple specks on leaves that expand into round lesions with tan centers and purple-brown halos ('frogeye' appearance).",
    treatment: "Prune out dead shoots, mummified fruits, and cankers at least 15cm below visible injury. Disinfect shears between cuts.",
    prevention: "Eliminate wild brambles and dead wood around the orchard. Maintain tree vigor with balanced fertilizer."
  },
  "Apple___Cedar_apple_rust": {
    crop: "Apple",
    disease: "Cedar Apple Rust",
    severity: "Medium",
    color: "amber",
    pathogen: "Gymnosporangium juniperi-virginianae (Fungus)",
    description: "A heteroecious rust fungus requiring both Eastern Red Cedar / Juniper and Apple / Crabapple trees to complete its life cycle.",
    symptoms: "Brilliant orange-yellow circular spots on upper leaf surfaces. Later in summer, small raised tube-like spore horns appear underneath.",
    treatment: "Apply preventative myclobutanil or sulfur sprays in spring when juniper galls are releasing gelatinous orange spores.",
    prevention: "Remove volunteer red cedar trees within a 1-2 km radius if feasible. Select rust-resistant cultivars."
  },
  "Apple___healthy": {
    crop: "Apple",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The apple foliage is vibrant, robust, and free of pathological symptoms.",
    symptoms: "Deep green leaves with uniform surface texture and healthy stomata.",
    treatment: "No action required. Continue seasonal orchard management.",
    prevention: "Maintain annual dormant pruning and monitor for seasonal pest presence."
  },

  // BLUEBERRY
  "Blueberry___healthy": {
    crop: "Blueberry",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "Healthy blueberry bush leaves showing excellent chlorophyll production.",
    symptoms: "Firm, glossy green foliage without chlorosis or necrosis.",
    treatment: "No treatment required.",
    prevention: "Maintain acidic soil pH (4.5 - 5.2) and pine bark mulch for optimal root health."
  },

  // CHERRY
  "Cherry_(including_sour)___Powdery_mildew": {
    crop: "Cherry",
    disease: "Powdery Mildew",
    severity: "Medium",
    color: "amber",
    pathogen: "Podosphaera clandestina (Fungus)",
    description: "Attacks young leaves and terminal shoots of sweet and sour cherry trees, restricting photosynthetic capability.",
    symptoms: "White powdery or talcum-like superficial fungal mycelium patches on leaf undersides, progressing to curling and leaf distortion.",
    treatment: "Apply wettable sulfur or horticultural oil sprays at petal fall and shuck fall stages.",
    prevention: "Avoid excessive spring nitrogen which forces tender vulnerable flush growth. Improve canopy aeration."
  },
  "Cherry_(including_sour)___healthy": {
    crop: "Cherry",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The cherry foliage is healthy, vibrant, and actively photosynthesizing.",
    symptoms: "Smooth leaf surface without powdery coatings or necrotic perforations.",
    treatment: "No treatment required.",
    prevention: "Monitor for aphid colonies and maintain regular drip irrigation."
  },

  // CORN / MAIZE
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    crop: "Corn (Maize)",
    disease: "Gray Leaf Spot",
    severity: "High",
    color: "rose",
    pathogen: "Cercospora zeae-maydis (Fungus)",
    description: "A major foliar disease of maize that spreads rapidly under warm, humid conditions and reduced-tillage fields.",
    symptoms: "Tan to rectangular lesions bounded sharply by parallel leaf veins. Lesions may coalesce, causing substantial leaf blighting.",
    treatment: "Foliar fungicides (strobilurins or triazoles) applied between VT (tasseling) and R2 (blister stage) when conditions warrant.",
    prevention: "Implement 2-year crop rotation with non-host crops (soybean, sorghum). Utilize residue-burial tillage or tolerant hybrids."
  },
  "Corn_(maize)___Common_rust_": {
    crop: "Corn (Maize)",
    disease: "Common Rust",
    severity: "Medium",
    color: "amber",
    pathogen: "Puccinia sorghi (Fungus)",
    description: "Airborne fungal pathogen that arrives via southern weather winds during mild, humid weather.",
    symptoms: "Oval to elongated cinnamon-brown pustules (uredinia) scattered across both upper and lower leaf surfaces, erupting powdery spores.",
    treatment: "Generally managed by host plant genetics. Fungicides are cost-effective primarily in seed production fields when severe.",
    prevention: "Plant corn hybrids carrying the Rp1-D rust resistance gene. Early planting can help avoid peak spore migration."
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    crop: "Corn (Maize)",
    disease: "Northern Corn Leaf Blight",
    severity: "High",
    color: "rose",
    pathogen: "Exserohilum turcicum (Fungus)",
    description: "Causes large necrotic lesions during moderate temperatures (18-27°C) accompanied by frequent rains or heavy dews.",
    symptoms: "Large, elongated cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long) on foliage.",
    treatment: "Apply registered triazole fungicides if lesions appear on the ear leaf or higher before silking.",
    prevention: "Utilize resistant hybrids with Ht resistance genes. Practice crop rotation and incorporate post-harvest crop residue."
  },
  "Corn_(maize)___healthy": {
    crop: "Corn (Maize)",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The maize leaf is clean, healthy, and showing robust photosynthetic potential.",
    symptoms: "Smooth linear leaves with crisp parallel veins and no rust pustules.",
    treatment: "No action required.",
    prevention: "Maintain balanced nitrogen applications and adequate field drainage."
  },

  // GRAPE
  "Grape___Black_rot": {
    crop: "Grape",
    disease: "Black Rot",
    severity: "High",
    color: "rose",
    pathogen: "Guignardia bidwellii (Fungus)",
    description: "Highly damaging grapevine disease affecting all green tissues, capable of completely destroying fruit clusters.",
    symptoms: "Small round reddish-brown spots with dark borders on leaves. Infected berries turn brown, shrivel into hard, black, wrinkled mummies.",
    treatment: "Apply myclobutanil, captan, or copper fungicide early in the season from bud break through veraison.",
    prevention: "Prune and destroy all mummified grapes and infected cane shoots. Ensure canopy management gives good sun exposure."
  },
  "Grape___Esca_(Black_Measles)": {
    crop: "Grape",
    disease: "Esca (Black Measles)",
    severity: "High",
    color: "rose",
    pathogen: "Phaeomoniella chlamydospora & Fomitiporia mediterranea",
    description: "Complex trunk fungal disease causing vascular discoloration, leaf necrosis, and berry spotting.",
    symptoms: "'Tiger-stripe' chlorotic and necrotic patterns between leaf veins. Berries develop pinpoint dark violet spots ('measles').",
    treatment: "No chemical cure once established in the wood. Trunk renewal by retraining healthy water sprouts can revive vines.",
    prevention: "Protect pruning wounds with wound sealants or biocontrol agents (Trichoderma). Avoid making pruning cuts during wet weather."
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    crop: "Grape",
    disease: "Leaf Blight (Pseudocercospora)",
    severity: "Medium",
    color: "amber",
    pathogen: "Pseudocercospora vitis (Fungus)",
    description: "Late-season foliar disease causing premature leaf fall and reduced winter hardiness in vines.",
    symptoms: "Irregular reddish-brown lesions with faint dark margins on upper surfaces; olive-brown fuzzy spore masses underneath.",
    treatment: "Post-harvest or summer copper and mancozeb sprays can restrict secondary spore generation.",
    prevention: "Prune vines to allow thorough wind penetration. Rake and dispose of autumn vine leaves."
  },
  "Grape___healthy": {
    crop: "Grape",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "Grapevine leaf is healthy, robust, with excellent chlorophyll coloration.",
    symptoms: "Palmate green leaves with intact margins and clear petiolar sinuses.",
    treatment: "No treatment required.",
    prevention: "Maintain regular shoot thinning, canopy positioning, and standard vineyard nutrition."
  },

  // ORANGE
  "Orange___Haunglongbing_(Citrus_greening)": {
    crop: "Orange / Citrus",
    disease: "Huanglongbing (Citrus Greening)",
    severity: "Critical",
    color: "rose",
    pathogen: "Candidatus Liberibacter asiaticus (Bacteria)",
    description: "The most destructive citrus disease in the world, vectored by the Asian Citrus Psyllid (Diaphorina citri).",
    symptoms: "Blotchy, asymmetrical yellow mottling on leaves crossing the veins. Yellow shoots ('yellow dragon'), small, bitter, lopsided fruit that fails to color properly.",
    treatment: "Currently incurable. Nutritional foliar sprays can temporarily sustain tree health, but infected trees must be safely removed to protect surrounding groves.",
    prevention: "Strict psyllid vector management using biological controls (Tamarixia radiata) and targeted sprays. Plant only certified disease-free nursery stock."
  },

  // PEACH
  "Peach___Bacterial_spot": {
    crop: "Peach",
    disease: "Bacterial Spot",
    severity: "High",
    color: "rose",
    pathogen: "Xanthomonas arboricola pv. pruni (Bacteria)",
    description: "Severe bacterial infection targeting stone fruits, causing leaf shot-holing, defoliation, and fruit pitting.",
    symptoms: "Small, angular purple-brown spots on leaves. Center tissues frequently fall out, leaving a 'shot-hole' appearance. Cracking gumming fruit lesions.",
    treatment: "Apply copper bactericides during dormancy and very low-rate copper formulations during early cover sprays.",
    prevention: "Select resistant peach cultivars. Plant windbreaks to reduce sandblasting injury that creates bacterial entry wounds."
  },
  "Peach___healthy": {
    crop: "Peach",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The peach foliage is in peak condition with no bacterial spotting.",
    symptoms: "Smooth lanceolate leaves with glossy green surface and intact margins.",
    treatment: "No treatment required.",
    prevention: "Maintain regular pruning to balance light penetration and air movement."
  },

  // PEPPER BELL
  "Pepper,_bell___Bacterial_spot": {
    crop: "Bell Pepper",
    disease: "Bacterial Spot",
    severity: "High",
    color: "rose",
    pathogen: "Xanthomonas campestris pv. vesicatoria",
    description: "Major disease of peppers in warm, rainy production areas causing rapid defoliation and fruit sunscald.",
    symptoms: "Small, water-soaked, angular spots that turn dark brown to black. Infected leaves yellow and drop easily when bumped.",
    treatment: "Spray copper hydroxide combined with mancozeb upon detection. Prune out badly infected plants immediately.",
    prevention: "Hot-water treat seeds (50°C for 25 minutes) before sowing. Employ drip irrigation to keep pepper leaves dry."
  },
  "Pepper,_bell___healthy": {
    crop: "Bell Pepper",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The bell pepper leaf is vibrant and healthy.",
    symptoms: "Deep emerald foliage, clear venation, without necrotic flecking or chlorosis.",
    treatment: "No treatment required.",
    prevention: "Provide consistent watering, calcium supplementation to prevent blossom end rot, and full sunlight."
  },

  // POTATO
  "Potato___Early_blight": {
    crop: "Potato",
    disease: "Early Blight",
    severity: "High",
    color: "rose",
    pathogen: "Alternaria solani (Fungus)",
    description: "Common foliar fungal disease that causes severe stress on potato plants as tubers are bulking.",
    symptoms: "Dark brown to black lesions showing concentric rings (target pattern), usually surrounded by yellow tissue.",
    treatment: "Apply protective contact fungicides (mancozeb, chlorothalonil) on a 7-14 day schedule when disease pressure starts.",
    prevention: "Ensure adequate nitrogen nutrition as plants age. Avoid excessive irrigation that prolongs leaf wetness."
  },
  "Potato___Late_blight": {
    crop: "Potato",
    disease: "Late Blight",
    severity: "Critical",
    color: "rose",
    pathogen: "Phytophthora infestans (Oomycete)",
    description: "The infamous Irish Potato Famine pathogen. Rapidly rots leaves, stems, and tubers in wet, humid conditions.",
    symptoms: "Large, water-soaked lesions turning brown-black with pale green halos. White downy mold develops underneath in humid weather.",
    treatment: "Act swiftly with systemic oomycete fungicides (mandipropamid, cymoxanil). Remove and destroy severely infected haulms.",
    prevention: "Plant certified disease-free seed tubers. Hill potatoes well to protect developing tubers from rain-washed spores."
  },
  "Potato___healthy": {
    crop: "Potato",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The potato foliage is vigorous and healthy.",
    symptoms: "Lush pinnate green leaves free of necrotic spots or water soaking.",
    treatment: "No treatment required.",
    prevention: "Keep plants hilled up, maintain even soil moisture, and scout weekly for potato beetles and blights."
  },

  // RASPBERRY
  "Raspberry___healthy": {
    crop: "Raspberry",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "Healthy raspberry cane leaf showing strong vigor.",
    symptoms: "Crisp serrated green leaves with clear light green undersides and healthy petioles.",
    treatment: "No treatment required.",
    prevention: "Prune out spent floricanes after fruiting to promote sunlight for primocane development."
  },

  // SOYBEAN
  "Soybean___healthy": {
    crop: "Soybean",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The soybean plant displays clean, trifoliate leaves with excellent vegetative health.",
    symptoms: "Vibrant uniform green trifoliate leaves with no bacterial pustules or rust.",
    treatment: "No treatment required.",
    prevention: "Maintain weed control and monitor for soybean aphid populations."
  },

  // SQUASH
  "Squash___Powdery_mildew": {
    crop: "Squash",
    disease: "Powdery Mildew",
    severity: "Medium",
    color: "amber",
    pathogen: "Podosphaera xanthii (Fungus)",
    description: "Extremely common cucurbit disease that spreads rapidly in shaded, dense plantings in dry, warm air.",
    symptoms: "Circular talcum-like white powdery fungal spots on both leaf surfaces and stems. Leaves eventually turn yellow, brown, and brittle.",
    treatment: "Spray with bio-fungicide (Bacillus amyloliquefaciens), potassium bicarbonate (3g/L water), or neem oil emulsion.",
    prevention: "Select powdery-mildew resistant squash varieties. Plant in full sun with plenty of spacing between hills."
  },

  // STRAWBERRY
  "Strawberry___Leaf_scorch": {
    crop: "Strawberry",
    disease: "Leaf Scorch",
    severity: "Medium",
    color: "amber",
    pathogen: "Diplocarpon earlianum (Fungus)",
    description: "Foliar pathogen that weakens strawberry crowns and significantly reduces yield over successive seasons.",
    symptoms: "Numerous small, dark purple or reddish-purple spots without white centers. In severe cases, leaf margins curl upward and appear scorched by fire.",
    treatment: "Mow and remove old leaves right after harvest renovation. Apply copper-based fungicides if disease persists in autumn.",
    prevention: "Use straw mulch to prevent soil splashing onto foliage. Plant on raised beds for drainage."
  },
  "Strawberry___healthy": {
    crop: "Strawberry",
    disease: "Healthy Leaf",
    severity: "Healthy",
    color: "emerald",
    pathogen: "None (Plant is in good health)",
    description: "The strawberry trifoliate leaf is completely healthy and producing abundant energy.",
    symptoms: "Glossy deep green leaves with crisp serrations and no necrotic margins.",
    treatment: "No treatment required.",
    prevention: "Keep runner growth under control, maintain clean straw mulch, and provide consistent drip irrigation."
  }
};

export const diseaseAliases = {
  "Cherry___Powdery_mildew": "Cherry_(including_sour)___Powdery_mildew",
  "Cherry___healthy": "Cherry_(including_sour)___healthy",
  "Corn___Cercospora_leaf_spot Gray_leaf_spot": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
  "Corn___Common_rust": "Corn_(maize)___Common_rust_",
  "Corn___Northern_Leaf_Blight": "Corn_(maize)___Northern_Leaf_Blight",
  "Corn___healthy": "Corn_(maize)___healthy"
};

export function getDiseaseDetails(label) {
  const resolved = diseaseInfo[label] || diseaseInfo[diseaseAliases[label]];
  if (resolved) return resolved;

  // Fallback for any unexpected format
  const parts = label.split("___");
  const crop = (parts[0] || "Plant").replace(/_/g, " ").replace(/,/g, "");
  const disease = (parts[1] || "Unspecified").replace(/_/g, " ");
  const isHealthy = disease.toLowerCase().includes("healthy");

  return {
    crop,
    disease,
    severity: isHealthy ? "Healthy" : "Medium",
    color: isHealthy ? "emerald" : "amber",
    pathogen: isHealthy ? "None" : "Pathogen identification pending",
    description: `Diagnosed as ${disease} affecting ${crop}.`,
    symptoms: isHealthy ? "No symptoms detected." : "Symptoms typical of " + disease + ".",
    treatment: isHealthy ? "No treatment needed." : "Consult your local agricultural extension service for registered remedies.",
    prevention: "Practice good crop hygiene, maintain balanced irrigation, and scout plants regularly."
  };
}
