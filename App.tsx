
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { SectionRenderer } from './components/SectionRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import Admin from './components/Admin';
import { db } from './lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const FALLBACK_DATA = {
  "site_settings": {
    "tagline": "Residential Design",
    "email": "info@wjcda.com",
    "social_links": [
      {
        "platform": "instagram",
        "url": "#"
      },
      {
        "platform": "linkedin",
        "url": "#"
      }
    ],
    "address": "620 S El Monte Ave, Los Altos, CA 94022",
    "footer_description": "A dedication to the residential design heritage of the Bay Area, crafting homes that endure for generations through thoughtful planning and meticulous materiality.",
    "phone": "650.941.6890",
    "logo": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779207325696-logo-cda.svg?alt=media&token=86d2bbcf-5d20-4fd2-a6df-7727aff038a4",
    "name": "Chapman Design Associates"
  },
  "pages": {
    "locations": {
      "page_title": "Regional Reach",
      "seo_title": "Regional Reach | Chapman Design Associates",
      "meta_description": "A curated list of our luxury residential architectural commissions across the San Francisco Bay Area.",
      "sections": [
        {
          "type": "locations_list",
          "title": "Regional Reach",
          "content": "Over the past thirty years, Chapman Design Associates has been entrusted with hundreds of residential commissions. Below is a selection of the communities where our work is prominently featured.",
          "locations": [
            {"city": "Palo Alto", "count": 215},
            {"city": "Los Altos", "count": 184},
            {"city": "Los Altos Hills", "count": 92},
            {"city": "Menlo Park", "count": 76},
            {"city": "Atherton", "count": 45},
            {"city": "Portola Valley", "count": 38},
            {"city": "Woodside", "count": 24},
            {"city": "Mountain View", "count": 55},
            {"city": "Sunnyvale", "count": 31},
            {"city": "Cupertino", "count": 18},
            {"city": "Carmel", "count": 4},
            {"city": "San Francisco", "count": 12}
          ]
        }
      ]
    },
    "about": {
      "page_title": "About CDA",
      "sections": [
        {
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300861505-001.webp?alt=media&token=2668b178-4fe6-49dc-9d7a-a18e5ab64a80",
          "title": "A Legacy of Local Design",
          "content": "Chapman Design Associates is a small residential design firm located in Los Altos, California. The Principal of the firm, Walter Chapman, has been designing homes for thirty years. Working primarily in the western foothill communities of Santa Clara and San Mateo counties, CDA has helped over 800 clients realize their goals and dreams for their homes and their families.\n\nAs a referral based company, personal attention to our client's needs, clear and efficiently prepared plans, and an eye for design have been the hallmark of our practice. A working relationship with planning and building department staffs, and connections with local contractors, ensures a smooth process for our clients.\n\nFrom the first conceptual design to the gleam of fresh paint on the finished product, our goal is to make the experience of building a home an enjoyable one. Please explore our site. We have tried to provide enough general information about how we work, examples of the homes we have designed and a few personal touches so that you may have a general sense of who we are, and what we can do to help you with your design needs.\n\n### Sincerely,\n\n**Walter Chapman and the staff at Chapman Design Associates**",
          "type": "standard"
        }
      ]
    },
    "additions": {
      "page_title": "Home Additions",
      "sections": [
        {
          "type": "standard",
          "content": "We approach additions and interior remodeling with the same rigor as our entirely new builds. Resolving the spatial and functional deficiencies of an older home requires precision and restraint. When executed correctly, the resulting spatial flow feels entirely natural, leaving no discernible transition—internally or externally—between the historic structure and the new architectural intervention.",
          "title": "Expanding Your Horizons",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208454067-001.webp?alt=media&token=07fd8086-70d4-4dc0-b3af-3b89adf66146"
        },
        {
          "type": "gallery",
          "images": [
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208463075-002.webp?alt=media&token=fb412a8c-eb53-4519-b8e7-3102b00c8ce3"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208463413-003.webp?alt=media&token=75c98f53-fa3a-4be9-b221-561617361b2f"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208463067-004.webp?alt=media&token=b2190e46-ff4b-4fd1-9b59-2bccb8885152",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208462733-005.webp?alt=media&token=e2ccd500-8a34-4b51-9a24-083827c1bd66"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208462733-006.webp?alt=media&token=6bcc3c08-6d2b-4d22-a7a1-e71d29568b2e",
              "caption": "New Image"
            }
          ]
        }
      ]
    },
    "adus": {
      "page_title": "Accessory Dwelling Units",
      "sections": [
        {
          "content": "ADUs provide versatile space for guests, family, or rental income. We specialize in efficient designs that make the most of limited footprints.",
          "title": "Smart Small-Scale Living",
          "type": "standard",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208482941-adu.webp?alt=media&token=93aa71ae-e9fa-4cbf-903d-81d41acc44ff"
        },
        {
          "images": [
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505709-001.webp?alt=media&token=f521841a-ff08-4f52-8c86-6c8c4250918f",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505727-002.webp?alt=media&token=c151d804-e75c-4263-96d6-c2c2b1c537ca",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505727-003.webp?alt=media&token=ac773f20-b634-4e54-83ea-09dbdfb862d1",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505728-004.webp?alt=media&token=6c4b8dab-76cd-40d4-bf1e-a8dd649b56bf",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505736-005.webp?alt=media&token=c03a0509-1c76-4379-b4a9-2dc3f1603023",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505743-006.webp?alt=media&token=35c18cfa-1a58-41e6-b0b2-41c2a2ad2cc5",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208505745-007.webp?alt=media&token=53d6e0e5-f7ba-49bd-806e-88b8895cb6e9"
            }
          ],
          "type": "gallery"
        }
      ]
    },
    "consultants": {
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
          "content": "In our thirty years of practice we have worked with many of the local contractors and maintain a preferred contractor list. Although we do recommend contractors from this list we do not supervise bidding or award contracts. We believe that all contractors should earn your business on their own merits.\n\nThe three factors that most home owners are faced with when making a final decision on which contractor to hire are typically affordability, availability & compatibility. Not always in that order. Affordability and availability are easily understood, however a compatible working relationship is often the most important factor in choosing a contractor.\n\nAll of the contractors we recommend must maintain a high standard of quality, reliability and professionalism in order to stay on our preferred list. We refer them with confidence that you will be satisfied with their performance."
        }
      ]
    },
    "featured-home": {
      "sections": [
        {
          "type": "standard",
          "title": "A Study in Light and Space",
          "content": "This featured project demonstrates our commitment to creating spaces that are both beautiful and highly functional. Every detail was carefully considered to harmonize with the site's natural topography.",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208296433-001.webp?alt=media&token=547aba48-6937-45cd-9102-c3bb1f369ec0"
        },
        {
          "images": [
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277488-002.webp?alt=media&token=cfcca35a-e708-48a4-b56f-b87fcf86aaca"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277483-003.webp?alt=media&token=6ae837e4-df90-40b0-b2df-93acf92926d0"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277484-004.webp?alt=media&token=359cecfd-b7cc-41cf-ad19-d32cf789967a",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277485-005.webp?alt=media&token=0bd1cf42-0131-4213-8c22-283747b376ac"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-006.webp?alt=media&token=7a784313-d4f4-40ec-bd31-d435c88a6e81"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277485-007.webp?alt=media&token=1f05f7a5-54b3-47b1-af87-4c3bdc4933db"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-008.webp?alt=media&token=410f349c-97bf-42e6-9d9a-bf76dab99829",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277485-009.webp?alt=media&token=eb7dab1c-37d9-41a9-8049-cc1dd8861a9d",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277486-010.webp?alt=media&token=a622e2e4-de05-4ae9-9c69-5a471cf47305"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277486-011.webp?alt=media&token=8433bec9-531d-4f68-9182-f9ff32dd5c25",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277486-012.webp?alt=media&token=976f9fff-8c6f-4d1b-9a11-405655fab4d9"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277486-013.webp?alt=media&token=a62a19c3-9f62-4998-883a-d9b70948adae",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277487-014.webp?alt=media&token=cf9003c8-53f4-471e-84a6-57175748aa95",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277487-015.webp?alt=media&token=d5f550ec-6ba0-4edb-b23e-0de76bd218d8",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277488-016.webp?alt=media&token=034d32e4-be01-4e73-a0c0-705cbeaa9d10",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277487-017.webp?alt=media&token=ddcbf249-76f3-4f0c-99b4-3180f4d0f016"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277487-018.webp?alt=media&token=46d04a80-4716-446d-8402-08742f68d11b"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277488-019.webp?alt=media&token=6b0d248a-f75f-4b10-8e16-5e467604d060"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277488-020.webp?alt=media&token=e58c4433-7be4-45b4-8149-1e8223fa9c70",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277488-021.webp?alt=media&token=2a111a51-4704-4945-8f59-ebd03d6a8c68"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277489-022.webp?alt=media&token=23258ab7-4c2a-4b52-aed4-45fb7a9b8518"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277492-023.webp?alt=media&token=e089db31-03aa-46c0-8f05-cecc4b4d361c"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277492-024.webp?alt=media&token=115133fc-da42-4f7e-a6c2-fc2ea1616908",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277492-025.webp?alt=media&token=6a9835b6-41e1-41eb-bace-7520e8a53f4f",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277493-026.webp?alt=media&token=8c65b338-a32e-4902-b6aa-571b5ce88e73",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277493-027.webp?alt=media&token=133831c1-d364-4cd1-ab7d-133594535e1a"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277493-028.webp?alt=media&token=e23eb6d6-bc04-4cd9-bfbd-16087073835f",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277493-029.webp?alt=media&token=ca201ea1-8525-4633-8e03-efdf51e22a63"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-030.webp?alt=media&token=d0231980-2e05-4677-bf82-c44b3b705883",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-031.webp?alt=media&token=e2519eeb-0882-4e07-8673-86517924d493",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277495-032.webp?alt=media&token=679036b6-ee23-43f7-8569-4bd00e5973b0"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-033.webp?alt=media&token=125b3373-22a0-4809-b72b-121c9320775a"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277655-034.webp?alt=media&token=24d3b121-aa2e-4697-b691-44b0471e377d"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277613-035.webp?alt=media&token=dc614f27-b528-4f0f-9966-4917c7578218"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277514-036.webp?alt=media&token=d34a5eb1-628b-430e-8eaa-2304fbba6fc4",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277560-037.webp?alt=media&token=a82146a6-0f9e-442b-b4e0-adf3ebee33e5"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277494-038.webp?alt=media&token=5350c1c7-73fc-400c-94e2-e95c89cae742"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277591-039.webp?alt=media&token=02cb86b0-f731-485e-a168-cf337ef82872",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277515-040.webp?alt=media&token=00b972ad-22a9-4a2b-8e13-29e2ee639008",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277495-041.webp?alt=media&token=09e7f946-f4c8-46aa-8a4c-208417101a5d"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208277686-042.webp?alt=media&token=cc2e1a37-0cb8-4373-9fdb-496ecd71e6a1",
              "caption": "New Image"
            }
          ],
          "type": "gallery"
        }
      ],
      "page_title": "Featured Residence"
    },
    "home": {
      "page_title": "Residential Design of Distinction",
      "sections": [
        {
          "content": "For three decades, Chapman Design Associates has helped shape the residential landscape of the Peninsula. Founded by Principal Walter Chapman and deeply rooted in the western foothills of Santa Clara and San Mateo counties, our studio has guided over 800 clients in translating their vision into enduring, deeply personal homes.",
          "title": "The Heritage",
          "type": "standard",
          "pos": "left",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208317709-front-1.webp?alt=media&token=6dae4d30-d7c9-46d7-b16a-0fa24a710483"
        },
        {
          "content": "As a purely referral-based practice, our foundation is built on trust and highly personalized attention. We pair an elevated eye for design with rigorous, efficiently prepared plans. Over thirty years, we have cultivated deep relationships with local planning departments and premier builders, ensuring that the journey—from the first conceptual sketch to the final coat of paint—is a seamless and rewarding experience.",
          "type": "standard",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208326625-new.webp?alt=media&token=6aec6815-0203-4fe9-8d74-b0be091c232c",
          "pos": "right",
          "title": "The Approach"
        },
        {
          "title": "The Portfolia",
          "pos": "left",
          "type": "standard",
          "content": "We believe the process of building a custom home should be as enjoyable as living in it. We invite you to explore a curated selection of our recent projects, offering a sense of who we are, how we work, and what we can do to bring your own vision to life.",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208338440-interior.webp?alt=media&token=008ae80e-d622-4dd5-88bd-787e26e4ab7b"
        }
      ],
      "meta_description": "Premier residential design firm in Los Altos, specializing in custom home planning and design for over 30 years.",
      "seo_title": "Chapman Design Associates | Residential Design Los Altos"
    },
    "interiors": {
      "page_title": "Interior Planning",
      "sections": [
        {
          "type": "standard",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208383264-001.webp?alt=media&token=fb70ed26-f550-48c1-a838-b36f3256b12a",
          "title": "The Art of the Interior",
          "content": "We believe that exceptional interior design begins long before the furnishings are selected; it begins with the bones of the house. Our focus is on creating spaces that flow naturally, defined by strong architectural volumes, meticulous millwork, and the deliberate capture of natural light. We design these environments to have a commanding presence, yet remain restrained enough to act as a quiet canvas, inviting each homeowner to layer in their own deeply personal style."
        },
        {
          "type": "gallery",
          "images": [
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398180-002.webp?alt=media&token=384edac4-7526-46b2-bee4-c9b89da99a16",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398166-003.webp?alt=media&token=cf990474-c911-40f4-8395-9e4c8f8de117",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398180-004.webp?alt=media&token=938aff03-105f-4b5f-b2df-803249373095",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398180-005.webp?alt=media&token=f4517139-eb52-4aba-8fbf-38588758894f",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-006.webp?alt=media&token=9cf128f4-6d67-40f1-96fc-7ca8624dcb73"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398180-007.webp?alt=media&token=8b452d31-ee6a-4e81-8af1-117a97583a63",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-008.webp?alt=media&token=08c9682c-b048-4b1f-8b1f-3d886cf99d94"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-009.webp?alt=media&token=8e42e71a-6097-43a7-afda-f82f374ed3e7",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-010.webp?alt=media&token=effb786c-ccd7-4d63-a5ed-b6bff7ef8d70"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-011.webp?alt=media&token=a2b5de03-b888-4292-bedc-6b00a1483de2"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398181-012.webp?alt=media&token=d8e35084-7deb-4dda-ad6e-6865abeb91a8",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398182-013.webp?alt=media&token=a34187dd-d6a9-4292-a5ca-3e52bff11846"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398182-014.webp?alt=media&token=34e3b950-612a-4cd5-be14-099a645b2989"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398183-015.webp?alt=media&token=76f8ccde-b7df-461e-b9cd-f2d9706506de"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398182-016.webp?alt=media&token=a672f7b6-8301-4e47-9be5-753375109948",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398183-017.webp?alt=media&token=19d5a131-ab56-4497-bab8-6989eb0d477e",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398183-018.webp?alt=media&token=af61a891-2daf-4c0b-8b99-aec995aa53fd",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398183-019.webp?alt=media&token=2584700c-cb69-47cd-b980-078a8aad669f"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398183-020.webp?alt=media&token=56955b5e-77b3-4eb1-a371-066f6c394101"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398184-021.webp?alt=media&token=47a23bce-78d2-4b13-a3c4-bc3d856a0878",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398184-022.webp?alt=media&token=329b71a1-a70a-47cf-ac11-d2b290215bda",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398184-023.webp?alt=media&token=9e94ce87-2567-4338-b344-db28195fd6a0"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398185-024.webp?alt=media&token=ec29f112-c670-4679-87cd-4cab25429651"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398184-025.webp?alt=media&token=f82381fc-cc55-44b0-a615-4236389b69a8",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398185-026.webp?alt=media&token=778f31f5-ebc4-437e-bac9-7f6b016a3be4",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398206-027.webp?alt=media&token=d1f7a4c0-8a43-4e0b-937a-6b0f62d85782",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398184-028.webp?alt=media&token=084137c5-05ad-4e0b-a289-c7f67f05f67b"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398205-029.webp?alt=media&token=a03ad9d1-ef90-45c3-aa92-c09afd2c63aa"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398206-030.webp?alt=media&token=d5bd7710-2a6b-4e2e-9160-64b9a945e731"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398206-031.webp?alt=media&token=a088d423-f653-4609-a004-9df6c793668f"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398207-032.webp?alt=media&token=2d955b83-b47f-49f2-9ce7-f7d687122327",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398207-033.webp?alt=media&token=36f4ed57-546a-4252-979d-8a77ab6d1310",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398209-034.webp?alt=media&token=ab36460e-a0c2-4768-bc31-a9c1262e826a"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208398208-035.webp?alt=media&token=b16f2b56-9379-40bb-aa4e-a01a1d87848e",
              "caption": "New Image"
            }
          ]
        }
      ]
    },
    "new-homes": {
      "page_title": "New Custom Homes",
      "sections": [
        {
          "content": "The defining characteristic of our new home portfolio is stylistic fluency. Rather than imposing a singular signature look, we design across a diverse spectrum of styles. By deeply understanding the unique massing, proportions, and meticulous details required of both classic and modern design, we create bespoke homes of uncompromising integrity.",
          "type": "standard",
          "title": "Ground-Up Design",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208417290-001.webp?alt=media&token=0bc901b8-1305-4172-b20e-5b398cfb5f42"
        },
        {
          "type": "gallery",
          "images": [
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429674-002.webp?alt=media&token=adbeaddd-7359-42f7-8f13-47e5b87b91be"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429675-003.webp?alt=media&token=16bcba21-607a-4ef4-907e-b1cac9350e3c"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429694-004.webp?alt=media&token=75a318f0-1d19-45bf-abac-29c184033e6b"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429694-005.webp?alt=media&token=f02840a1-d751-40ae-9e30-112cad8ab4ae"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429695-006.webp?alt=media&token=cc361391-16e7-4b8c-83a1-7222395e5ead"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429709-007.webp?alt=media&token=45644664-2edc-4432-afb0-c06f6f83c923",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429720-008.webp?alt=media&token=4f66b5ce-86b0-4f92-90be-e5424a989ef1",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429713-009.webp?alt=media&token=68c209d0-5aa5-431c-8eda-92b14b07457c"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429759-010.webp?alt=media&token=a66f53d6-22db-45ff-895a-d4174d26df29",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429786-011.webp?alt=media&token=35a59af5-41da-46fe-9e78-73a7e8ddbee5"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429802-012.webp?alt=media&token=f1b3c321-8b4d-4f8d-baf4-3987618d9736"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429822-013.webp?alt=media&token=3888618b-769a-42ad-aabb-a9252f4dd31a",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429816-014.webp?alt=media&token=69664cb6-2bce-44fd-a3cc-82e7a3c08075"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429798-015.webp?alt=media&token=62fffc6a-668c-42ea-8cf6-c1a3e02eec3e",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208429824-016.webp?alt=media&token=d18268f0-95ac-4396-a029-aa98990e5f04"
            }
          ]
        }
      ]
    },
    "remodels": {
      "sections": [
        {
          "title": "Transforming Spaces",
          "image": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208543976-remodels.webp?alt=media&token=ef675865-faa5-4d62-9074-223e57b82485",
          "content": "Remodeling requires a sensitive touch to blend the old with the new. We help homeowners reimagine their existing spaces to better suit contemporary lifestyles while respecting the original structure.",
          "type": "standard"
        },
        {
          "type": "gallery",
          "images": [
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556667-001.webp?alt=media&token=2a7e7204-794f-4da0-b38d-522c3316a8d8"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556670-002.webp?alt=media&token=3e2fa499-6eec-4ed2-8d4f-a03abd304d43"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556669-003.webp?alt=media&token=043b1278-da3b-4c24-93fc-d4e1ec481667",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556669-004.webp?alt=media&token=b4615bb2-2a6f-4d63-9075-67317d363f3c"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556667-005.webp?alt=media&token=ff0a7028-17f3-441b-81ac-24780d4bf928",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556678-006.webp?alt=media&token=5857b130-8998-4771-a771-c1b587d87038",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556679-007.webp?alt=media&token=af71ef46-ac58-417a-974b-e2e2a524ba32"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556690-008.webp?alt=media&token=aedab3a3-c7fe-4576-8881-b07e12119e12",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556696-009.webp?alt=media&token=bd32c984-ba06-4535-9cda-cf54da3aaf93",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556670-010.webp?alt=media&token=d75aa4a9-ddbb-45e2-83c8-b08c346b8364",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556681-011.webp?alt=media&token=04594924-477e-4db7-98dc-daffb5be6983",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556669-012.webp?alt=media&token=a7fa92d7-952f-403c-b28b-62ea3424b3e6",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556670-013.webp?alt=media&token=6ae3ce0e-5dca-4217-8fae-93b0e352e2b4",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556707-014.webp?alt=media&token=bb516350-c424-41a8-8f55-b4c72507789e",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556668-015.webp?alt=media&token=b233f773-c4ed-48d0-adae-33533d431e66",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556677-016.webp?alt=media&token=2ae49ff5-ff45-459a-b36c-dfd3ca9599fd",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556710-017.webp?alt=media&token=32e6b8b7-ccb1-4e78-b529-545622aa2fa5",
              "caption": "New Image"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556669-018.webp?alt=media&token=432f2b04-0b77-4847-a18f-5d5a60546a3c",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779208556668-019.webp?alt=media&token=d7397422-f68b-45d4-bdfe-1998d94ecaac"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963311-002.webp?alt=media&token=3dc1570b-7980-4743-b12c-2adebc082d1e"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963329-003.webp?alt=media&token=dad843d7-5210-498a-8df5-58716702e104",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963339-004.webp?alt=media&token=5f24f772-deee-4e53-beda-12e136b46792"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963329-005.webp?alt=media&token=2cf79d13-4a7f-40de-9385-7a82c63f5cc3"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963328-006.webp?alt=media&token=783cdf04-dbef-4b72-9b00-dcda3749d575"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963341-008.webp?alt=media&token=8144968b-929d-412f-be44-eba604b36916",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963330-009.webp?alt=media&token=f2e0b8bd-0aac-4f7f-afe2-935e06a2d748"
            },
            {
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963344-010.webp?alt=media&token=afb4e774-f6bf-4956-9f32-e05025ffa967",
              "caption": "New Image"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963352-011.webp?alt=media&token=8ff2acf9-229b-414a-90e9-bfafc2781ab8"
            },
            {
              "caption": "New Image",
              "file": "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0357827002.firebasestorage.app/o/uploads%2F1779300963352-016.webp?alt=media&token=744169e1-537b-4cfe-a12d-cc5907ae1175"
            }
          ]
        }
      ],
      "page_title": "Residential Remodels"
    },
    "reviews": {
      "page_title": "Client Perspectives",
      "seo_title": "Client Reviews & Testimonials | Chapman Design Associates",
      "meta_description": "Read verified client reviews and testimonials for Chapman Design Associates, creating bespoke residential architecture across the San Francisco Bay Area.",
      "sections": [
        {
          "type": "reviews_list",
          "title": "Client Perspectives",
          "content": "Over three decades and more than 800 residential commissions across Silicon Valley and the Peninsula, our practice has been built almost entirely on client referrals and enduring relationships. Here is what homeowners share about partnering with Chapman Design Associates.",
          "reviews": [
            {
              "quote": "Working with Walter Chapman was an exceptional experience from concept through completion. He listened intently to our lifestyle needs and crafted an architectural plan that maximized natural light and seamless indoor-outdoor flow. His deep familiarity with local planning departments made the permit approval process in Los Altos remarkably smooth.",
              "author": "Private Homeowner",
              "location": "Los Altos, CA",
              "projectType": "Custom Single-Family Residence",
              "source": "Houzz",
              "rating": 5,
              "year": "2024"
            },
            {
              "quote": "Chapman Design Associates transformed our mid-century home into a contemporary architectural masterpiece while honoring the neighborhood context. Walter's structural clarity, attention to sightlines, and coordination with our engineer and general contractor saved us substantial time and construction expense.",
              "author": "The D. Family",
              "location": "Old Palo Alto, CA",
              "projectType": "Major Renovation & 2nd Story Addition",
              "source": "Houzz",
              "rating": 5,
              "year": "2023"
            },
            {
              "quote": "After interviewing several prominent Bay Area residential designers, we selected Walter for his balance of aesthetic elegance and practical construction sense. His mastery of hillside zoning and municipal requirements in Los Altos Hills gave us complete confidence throughout a multi-year build.",
              "author": "New Residence Client",
              "location": "Los Altos Hills, CA",
              "projectType": "Hillside Custom Home",
              "source": "Google",
              "rating": 5,
              "year": "2023"
            },
            {
              "quote": "Walter's design for our detached guest house and ADU was brilliant. He maximized every square foot with vaulted ceilings and meticulous detail. Our general contractor noted that Chapman Design's construction drawings were among the cleanest and most thorough they had ever built from.",
              "author": "R. & S. Miller",
              "location": "Menlo Park, CA",
              "projectType": "Custom ADU & Outdoor Living",
              "source": "Google",
              "rating": 5,
              "year": "2022"
            }
          ],
          "badges": [
            {
              "platform": "Houzz",
              "url": "https://www.houzz.com",
              "label": "Read Verified Reviews on Houzz",
              "ratingNote": "5.0 ★ Rating"
            },
            {
              "platform": "Google",
              "url": "https://www.google.com",
              "label": "Google Business Reviews",
              "ratingNote": "5.0 ★ Rating"
            }
          ]
        }
      ]
    },
    "services": {
      "page_title": "Our Services",
      "sections": [
        {
          "content": "From initial site strategy to final interior planning, we provide a full range of residential design services tailored to your specific needs.",
          "title": "Comprehensive Design",
          "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200",
          "type": "standard"
        }
      ]
    }
  }
};

const App: React.FC = () => {
  const getPageFromUrl = () => {
    if (typeof window === 'undefined') return 'home';
    
    const path = window.location.pathname;
    const rawHash = window.location.hash;
    const hash = rawHash.replace(/^#\/?/, '').split('?')[0].split('/')[0].toLowerCase();
    const search = window.location.search;
    const queryParams = new URLSearchParams(search);
    const pathParts = path.split('/').filter(p => p && p !== 'index.html' && p !== '');
    
    const normalize = (s: string) => s ? s.replace(/\.html$/, '').toLowerCase() : '';

    // 1. Check for Admin
    const isAskingForAdmin = 
      pathParts.some(p => normalize(p) === 'admin') || 
      normalize(hash) === 'admin' || 
      queryParams.has('admin') ||
      window.location.href.toLowerCase().includes('/admin');

    if (isAskingForAdmin) return 'admin';
    
    // 2. Check Path
    const pageFromPath = pathParts[pathParts.length - 1];
    if (pageFromPath && normalize(pageFromPath) !== 'index') return normalize(pageFromPath);
    
    // 3. Check Hash
    if (hash) return normalize(hash);

    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromUrl());
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Persist page changes to localStorage for session continuity
  useEffect(() => {
    if (currentPage) {
      try {
        localStorage.setItem('cda_current_page', currentPage);
      } catch (e) {}
    }
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- 1. Try Firebase Firestore (The New Standard) ---
        const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
        if (settingsSnap.exists()) {
          const pagesSnap = await getDocs(collection(db, 'pages'));
          const pagesData: any = {};
          pagesSnap.forEach(doc => {
            pagesData[doc.id] = doc.data();
          });
          
          const fullData = {
            site_settings: settingsSnap.data(),
            pages: pagesData
          };
          
          
          
          if (fullData.pages && (!fullData.pages.reviews || !fullData.pages.reviews.sections?.some((s: any) => s.type === 'reviews_list'))) {
            fullData.pages.reviews = FALLBACK_DATA.pages.reviews;
          }
if (fullData.pages && !fullData.pages.locations) {
            fullData.pages.locations = FALLBACK_DATA.pages.locations;
          }
if (fullData.pages && fullData.pages.about && fullData.pages.about.page_title === "About the Studio") {
            fullData.pages.about.page_title = "About CDA";
          }
          
          setSiteData(fullData);
          try {
            localStorage.setItem('cda_site_data', JSON.stringify(fullData));
          } catch (e) {}
          setLoading(false);
          return;
        } else {
          // Database is connected but empty. Fallback immediately to defaults so admin can be accessed to save.
          setSiteData(FALLBACK_DATA);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Firestore fetch failed:', err);
      }

      try {
        // --- 2. Check localStorage for session persistence ---
        const savedData = localStorage.getItem('cda_site_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          
          
          if (parsed.pages && (!parsed.pages.reviews || !parsed.pages.reviews.sections?.some((s: any) => s.type === 'reviews_list'))) {
            parsed.pages.reviews = FALLBACK_DATA.pages.reviews;
          }
if (parsed.pages && !parsed.pages.locations) {
            parsed.pages.locations = FALLBACK_DATA.pages.locations;
          }
if (parsed.pages && parsed.pages.about && parsed.pages.about.page_title === "About the Studio") {
            parsed.pages.about.page_title = "About CDA";
          }
          setSiteData(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.warn('localStorage access failed');
      }

      try {
        // --- 3. Try to fetch from Node API (Legacy/Local Dev) ---
        const response = await fetch('/api/content');
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (data.pages && !data.pages.locations) {
              data.pages.locations = FALLBACK_DATA.pages.locations;
            }

            if (data.pages && !data.pages.locations) {
              data.pages.locations = FALLBACK_DATA.pages.locations;
            }
if (data.pages && data.pages.about && data.pages.about.page_title === "About the Studio") {
              data.pages.about.page_title = "About CDA";
            }
            setSiteData(data);
            try {
              localStorage.setItem('cda_site_data', JSON.stringify(data));
            } catch (e) {}
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Node API not available');
      }

      try {
        // --- 4. Fallback to local JSON file ---
        const response = await fetch('/data/content.json');
        if (response.ok) {
          const data = await response.json();
          if (data.pages && data.pages.about && data.pages.about.page_title === "About the Studio") {
            data.pages.about.page_title = "About CDA";
          }
          let hasLocalChanges = false;
          try { hasLocalChanges = !!localStorage.getItem('cda_site_data'); } catch (e) {}
          
          if (!hasLocalChanges || !siteData) {
            setSiteData(data);
          }
        } else {
          throw new Error('Local JSON not found');
        }
      } catch (err) {
        if (!siteData) {
          console.error('Failed to load local data, using hardcoded fallback');
          setSiteData(FALLBACK_DATA);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleRouteChange = (e?: Event) => {
      const nextPage = getPageFromUrl();
      setCurrentPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    
    // Initial check to ensure state matches URL
    handleRouteChange();

    // Intercept all internal link clicks to use pushState
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin) && !anchor.hasAttribute('download') && anchor.target !== '_blank') {
        e.preventDefault();
        const url = new URL(anchor.href);
        const relativeUrl = url.pathname + url.search + url.hash;
        window.history.pushState({}, '', relativeUrl);
        handleRouteChange();
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    if (siteData) {
      const pageKey = currentPage;
      const pageData = siteData?.pages?.[pageKey] || FALLBACK_DATA.pages[pageKey as keyof typeof FALLBACK_DATA.pages] || siteData?.pages?.home || FALLBACK_DATA.pages.home;
      const siteName = siteData?.site_settings?.name || 'Chapman Design Associates';
      const tagline = siteData?.site_settings?.tagline || '';
      
      // Update Title
      document.title = `${pageData.page_title} | ${siteName}`;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', pageData.meta_description || siteData?.site_settings?.footer_description || '');

      // Update Open Graph Tags
      const updateOG = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      updateOG('og:title', `${pageData.page_title} | ${siteName}`);
      updateOG('og:description', pageData.meta_description || siteData?.site_settings?.footer_description || '');
      updateOG('og:type', 'website');
      updateOG('og:url', window.location.href);
      if (siteData?.site_settings?.logo) {
        updateOG('og:image', siteData.site_settings.logo);
      }

      // Inject JSON-LD Schema
      const schemaId = 'json-ld-schema';
      let script = document.getElementById(schemaId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": siteName,
        "description": siteData?.site_settings?.footer_description,
        "url": "https://wjcda.com",
        "telephone": siteData?.site_settings?.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": siteData?.site_settings?.address
        },
        "image": siteData?.site_settings?.logo,
        "sameAs": siteData?.site_settings?.social_links?.map((s: any) => s.url) || []
      };

      script.text = JSON.stringify(schema);
    }
  }, [currentPage, siteData]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-[11px] uppercase tracking-[1em] text-stone-300 animate-pulse">Loading Studio</div>
    </div>
  );

  if (!siteData) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-4">
        <p className="text-stone-600 text-[11px] uppercase tracking-widest font-bold">Error Loading Studio Data</p>
        <p className="text-stone-400 text-xs max-w-xs mx-auto">Please ensure the public/data/content.json file exists and is valid JSON.</p>
        <button onClick={() => window.location.reload()} className="text-xs font-bold border-b border-stone-900 pb-1">Retry Connection</button>
      </div>
    </div>
  );

  if (currentPage === 'admin') {
    return <Admin initialData={siteData} onSave={(newData: any) => setSiteData(newData)} />;
  }

  const getLogoUrl = (logo: string) => {
    if (!logo) return '';
    if (logo.startsWith('data:') || logo.startsWith('http') || logo.startsWith('/')) return logo;
    return `/${logo}`;
  };

  // Map sub-project routes to their data keys if they differ
  const pageKey = currentPage;
  const pageData = siteData?.pages?.[pageKey] || FALLBACK_DATA.pages[pageKey as keyof typeof FALLBACK_DATA.pages] || siteData?.pages?.home || FALLBACK_DATA.pages.home;

  return (
    <Layout activePage={currentPage} settings={siteData?.site_settings}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          {currentPage === 'home' ? (
            <div className="mb-16 pb-12 border-b border-stone-200/60">
              <span className="text-[11px] uppercase tracking-[0.5em] text-stone-500 font-bold mb-6 block">
                {pageData.page_title}
              </span>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-stone-900 leading-none tracking-tighter">
                  {siteData?.site_settings?.name}
                </h1>
                {siteData?.site_settings?.logo && (
                  <div className="shrink-0 animate-fade-in">
                    <img 
                      src={getLogoUrl(siteData.site_settings.logo)} 
                      alt={siteData.site_settings.name} 
                      className="h-24 md:h-36 w-auto object-contain select-none mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-16 pb-12 border-b border-stone-200/60">
              <span className="text-[11px] uppercase tracking-[0.5em] text-stone-500 font-bold mb-4 block">
                {siteData?.site_settings?.name}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-stone-900 leading-[0.9] tracking-tighter mb-8 max-w-full">
                {pageData.page_title}
              </h1>
              <div className="h-0.5 w-16 bg-stone-900"></div>
            </div>
          )}
          
          <SectionRenderer 
            sections={pageData.sections} 
            logoUrl={undefined}
            siteName={siteData?.site_settings?.name}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-32 pt-16 border-t border-stone-100 text-center flex flex-col items-center">
        <div className="brand-font text-2xl text-stone-600 mb-4 select-none">CDA</div>
        <p className="text-stone-600 text-[11px] uppercase tracking-[0.3em] font-bold max-w-xs mx-auto leading-relaxed">
          Residential Design • Interior Planning • Site Strategy
        </p>
      </div>
    </Layout>
  );
};

export default App;
