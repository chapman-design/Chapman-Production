const fs = require('fs');

let code = fs.readFileSync('App.tsx', 'utf8');

const oldConsultants = `"consultants": {
      "page_title": "Our Consultants",
      "sections": [
        {
          "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
          "type": "standard",
          "content": "We collaborate with a trusted network of structural engineers, landscape designers, and contractors to ensure every project is built to the highest standards.",
          "title": "A Network of Experts"
        }
      ]
    }`;

const newConsultants = `"consultants": {
      "page_title": "CDA Consultants",
      "sections": [
        {
          "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
          "type": "standard",
          "title": "Surveying",
          "content": "Depending on the size and scope of work proposed, the site of any project may need to be surveyed. For remodels this may be to verify the placement of the existing structure on the site as well as the grade levels around the house to ensure compliance with zoning rules. For new homes the average slope of the site is often required to determine the allowable size for a proposed residence."
        },
        {
          "type": "standard",
          "title": "Structural Engineering",
          "content": "Literally the nuts and bolts of residential design. Since the Loma Prietta earthquake engineering requirements and documentation has increased exponentially like the Reichter scale. A solid grasp of the techniques and products developed to address new engineering concerns is important in containing the cost of construction. Terms such as shear walls, hold downs, strong-walls and lateral frames will quickly become a part of your vocabulary."
        },
        {
          "type": "standard",
          "title": "Soils Engineer",
          "content": "Soils investigation can be a critical aspect of a home owner's design considerations. The decision whether or not to build a basement may be dependent on sub-surface water tables. Will the cost of a foundation be affected by the type of soil encountered on the site? The answer to these types of questions can only be resolved with a soils report. When considering building a new home a soils report is highly recommended, when building in hillside communities, it is often required."
        },
        {
          "type": "standard",
          "title": "T-24 Energy Review",
          "content": "Even the most modest addition and remodels are subject to state requirements that the building be more energy efficient when altered from its current configuration. New houses however are required to meet a much higher standard of energy compliance. A title-24 analysis will ensure that not only will your new home comply but that it will maintain a comfortable environment and maximize energy efficiency."
        },
        {
          "type": "standard",
          "title": "Civil Engineer",
          "content": "The primary service of the civil engineer is to control and manage the flow of water that crosses a property or falls from the sky. A simple statement for which there is not always a simple answer. Federal and State laws which restrict runoff of storm water have led to the requirement of on site retention systems that can hamper the development of a site. Extensive grading and drainage plans are required by most hillside communities."
        },
        {
          "type": "standard",
          "title": "Landscape Design",
          "content": "With every home we design we are acutely aware of the site and it's surroundings. The view from each room as well as accessibility to the yard is important to the livability of a home. Our attention to this fact is only the beginning of the possibilities that may exist for your property. A landscape Architect or Designer can add another level of features, from fountains and ponds, to arbors and gazebos. Add to this their knowledge of lighting and vegetation and the picture will become complete."
        },
        {
          "type": "standard",
          "title": "Interior Design",
          "content": "Just as we walk you through the process of design, construction documents and permitting of plans for your home, an interior designer will help you through myriad of decisions that must be made to complete the interior of your home. From cabinets and appliances, to plumbing and lighting fixtures, to the decision of marble versus granite or tile you will find that an interior designer is an invaluable asset to any project."
        },
        {
          "type": "standard",
          "title": "Contractors",
          "content": "In our thirty years of practice we have worked with many of the local contractors and maintain a preferred contractor list. Although we do recommend contractors from this list we do not supervise bidding or award contracts. We believe that all contractors should earn your business on their own merits.\\n\\nThe three factors that most home owners are faced with when making a final decision on which contractor to hire are typically affordability, availability & compatibility. Not always in that order. Affordability and availability are easily understood, however a compatible working relationship is often the most important factor in choosing a contractor.\\n\\nAll of the contractors we recommend must maintain a high standard of quality, reliability and professionalism in order to stay on our preferred list. We refer them with confidence that you will be satisfied with their performance."
        }
      ]
    }`;

if (code.includes(oldConsultants)) {
    fs.writeFileSync('App.tsx', code.replace(oldConsultants, newConsultants));
    console.log("Successfully replaced consultants data");
} else {
    console.log("Could not find old string to replace");
}
