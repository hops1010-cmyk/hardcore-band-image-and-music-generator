import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator when API key is missing or model is unavailable
function getMockBand(genreReq?: string, promptReq?: string) {
  const genres = ['Djent / Progressive Metalcore', 'Grindcore / Powerviolence', 'Hardcore / Beatdown', 'Deathcore / Slam'];
  const genre = genreReq || genres[Math.floor(Math.random() * genres.length)];

  if (genre.toLowerCase().includes('djent')) {
    return {
      name: "TESSERACTAL FRACTURE",
      genre: "Technical Djent / Progressive Metal",
      logoStyle: "djent_cyber_geom",
      hometown: "Umeå, Sweden / Gothenburg",
      label: "Sumerian Crypt Records",
      tuning: "Drop E (8-String Headless)",
      bpm: 145,
      timeSignature: "17/16 against 4/4",
      albumTitle: "THE ENTROPIC MONOLITH",
      releaseYear: 2026,
      albumConcept: "A multi-dimensional traversal through cybernetic dread, synthetic consciousness, and zero-point non-euclidean geometry.",
      artDescription: "A colossal biomechanical obsidian monolith floating in an abyssal cyber-fractal cosmos with glowing cyan wires.",
      recommendedArtStyle: "djent",
      members: [
        { role: "8-String Guitars & Sound Design", name: "Kaelen Vane", gear: "Strandberg Boden 8, Quad Cortex, Neural DSP" },
        { role: "Polyrhythmic Percussion", name: "Jonas Richter", gear: "Pearl Masterworks, Meinl Dark Byzance Custom Cymbals" },
        { role: "Low-End / Sub Frequencies", name: "Vesper Thorne", gear: "Dingwall NG3 5-String, Darkglass B7K Ultra" },
        { role: "Harsh Throat / Glitch Vocals", name: "Riku Lindqvist", gear: "Shure SM7B, Eventide Space Reverb" }
      ],
      tourDates: [
        { venue: "Subterranean Forge", city: "Berlin, DE", date: "NOV 14", supportingBands: ["Mesh-Vector", "Quantized Void"] },
        { venue: "The Electric Crypt", city: "London, UK", date: "NOV 18", supportingBands: ["Zero Gravity Slam"] },
        { venue: "Knitting Factory", city: "Brooklyn, NY", date: "DEC 02", supportingBands: ["Algorithmic Agony", "Binary Pulse"] }
      ],
      tracks: [
        {
          title: "Synaptic Decimation",
          duration: "3:42",
          lyrics: "[BLEGH]\nCALCULATED SUFFERING\nIN THE MATRIX OF RECURSIVE TORMENT\nWE ARE THE PARASITES OF REASON\n[BASS DROP]\n0 - 0 - 0 - 0\nCOLLAPSE THE QUANTUM WAVE\nNOTHING SURVIVES THE OBSERVATION\n[DISSONANT SQUEAL]\nDIE IN PERPETUITY!",
          breakdownCallout: "DISMANTLE THE ARCHITECTURE!",
          riffTabs: "F |-----------------------------|\nC |-----------------------------|\nG#|-----------------------------|\nD#|-----------------------------|\nA#|-----------------------------|\nF |-----------------------------|\nC |-----------------------------|\nF |-0-0-0-1-0-0--0-0-3-0-1-0-0--|",
          tempo: 142,
          timeSig: "7/8",
          riffSequence: [0, 0, 0, 1, 0, 0, 3, 0, 1, 0, 0, 5, 0, 1],
          drumPattern: "polyrhythm_djent"
        },
        {
          title: "Recursive Void Paradigm",
          duration: "4:15",
          lyrics: "CHRONOS DEVOURS ITS OWN PROGENY\nMECHANIZED BONE MEETS FIBER-OPTIC FLESH\n[GUTTURAL GROWL]\nTHE EQUATION REMAINS UNSOLVED\n[PIG SQUEAL]\nEXECUTE PURGE PROTOCOL!",
          breakdownCallout: "BLEGH!",
          riffTabs: "F |-0-0-0--0-0-0--1-0--0-0-0-0-|\nC |-0-0-0--0-0-0--1-0--0-0-0-0-|",
          tempo: 135,
          timeSig: "13/16",
          riffSequence: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 2, 0, 1],
          drumPattern: "breakdown"
        },
        {
          title: "Event Horizon Dissection",
          duration: "5:08",
          lyrics: "PULLED BEYOND THE TANGIBLE THRESHOLD\nGRAVITATIONAL SHIFT CRUSHES THE MARROW\nSPAGHETTIFIED SOULS SCREAMING IN BINARY\nENDLESS DENSITY\nENDLESS PRESSURE.",
          breakdownCallout: "FEEL THE GRAVITY!",
          riffTabs: "F |-0-1-0-0--0-1-0-0--6-5-0-0--|",
          tempo: 150,
          timeSig: "4/4",
          riffSequence: [0, 1, 0, 0, 0, 1, 0, 0, 6, 5, 0, 0],
          drumPattern: "polyrhythm_djent"
        }
      ],
      merchSlogan: "NEVER SOLVE THE EQUATION // 8-STRING HEAVYWEIGHT",
      bio: "Forged in the sub-zero frost of Scandinavia, TESSERACTAL FRACTURE crafts punishing polyrhythmic sonic geometry combining down-tuned baritone violence with quantum existential dread."
    };
  } else if (genre.toLowerCase().includes('grind')) {
    return {
      name: "PUTRID CAUSTIC SEPTICEMIA",
      genre: "Grindcore / Goregrind / Powerviolence",
      logoStyle: "grindcore_branches",
      hometown: "Birmingham, UK / Cleveland, OH",
      label: "Rotten Intestine Cassettes",
      tuning: "Drop A (Sludgy & Rotted)",
      bpm: 260,
      timeSignature: "4/4 (Hyper Blast)",
      albumTitle: "VISCERAL NECROSIS EP",
      releaseYear: 2026,
      albumConcept: "Raw, unmastered 12-minute barrage of blast beats, pitch-shifted sewer gutturals, and tape-hiss industrial grinding.",
      artDescription: "A xerox photocopied collage of rusted surgical clamps, barbed wire, decayed medical morgue slides, and pitch black grime.",
      recommendedArtStyle: "grindcore",
      members: [
        { role: "Chainsaw Buzzsaw Guitar", name: "Gore-Slinger Mick", gear: "Boss HM-2 Maxed Out, Marshall JCM800" },
        { role: "Hyper-Velocity Blast Machine", name: "Dave 'The Hammer' C.", gear: "Triggered Piccolo Snare, Twin Cam Double Pedals" },
        { role: "Sub-Sonic Rotted Bass", name: "Ratchet", gear: "Peavey MegaBass, Big Muff Pi" },
        { role: "Pitch-Shifted Sewer Gutturals & Shouts", name: "Stench", gear: "Digitech Whammy, Shure 55SH" }
      ],
      tourDates: [
        { venue: "VFW Basement Hall", city: "Philadelphia, PA", date: "OCT 12", supportingBands: ["Corpse Mutilation", "Ear Bleed"] },
        { venue: "The Sewer Squat", city: "Leipzig, DE", date: "OCT 25", supportingBands: ["Grind Bastards"] },
        { venue: "CBGB Memorial Dumpster", city: "New York, NY", date: "NOV 04", supportingBands: ["Maggot Swarm"] }
      ],
      tracks: [
        {
          title: "Surgical Saw Malfunction (0:34)",
          duration: "0:34",
          lyrics: "[PIG SQUEAL]\nSPLATTERED ACROSS THE TILES\nTEETH CHATTERING IN FORMALDEHYDE\nBLAST!\nBLAST!\nBLAST!\n[GUTTURAL COUGH]\nDEAD ON ARRIVAL!",
          breakdownCallout: "ROT!",
          riffTabs: "A |-0-1-0-1-0-1-0-1--3-2-1-0-|\nD |-0-1-0-1-0-1-0-1--3-2-1-0-|",
          tempo: 280,
          timeSig: "4/4",
          riffSequence: [0, 1, 0, 1, 0, 1, 3, 2, 1, 0, 0, 1, 4, 3],
          drumPattern: "blast_beat"
        },
        {
          title: "Intestinal Sludge Regurgitation",
          duration: "0:48",
          lyrics: "[INHALED SQUEAL]\nBILE IN THE VALVE\nCHOKE ON THE EFFLUENT\nNO OXYGEN\nNO MERCY\n[BASS DROP]\nDRAIN THE CORPSE!",
          breakdownCallout: "SUFFOCATE!",
          riffTabs: "A |-0-0-0--1-1-1--0-0-0--4-4-4-|",
          tempo: 260,
          timeSig: "4/4",
          riffSequence: [0, 0, 0, 1, 1, 1, 0, 0, 0, 4, 3, 2, 1, 0],
          drumPattern: "blast_beat"
        },
        {
          title: "Autopsy Table Collapse",
          duration: "1:02",
          lyrics: "SLURRY IN THE TROUGH\nHEAVY METALS IN THE SPLEEN\nPURE RANCID TORTURE\nSLOOOOOW DOWWWWN\n[HALF TIME SLAM]\nCRUSH!",
          breakdownCallout: "SLAM IT!",
          riffTabs: "A |-0---0---0---1---0---0---6-5-|",
          tempo: 120,
          timeSig: "4/4",
          riffSequence: [0, 0, 0, 1, 0, 0, 6, 5, 0, 0, 1, 0],
          drumPattern: "half_time_slam"
        }
      ],
      merchSlogan: "MAXED OUT HM-2 OR NOTHING // EAR DAMAGE GUARANTEED",
      bio: "Playing at speeds surpassing human cartilage endurance, PUTRID CAUSTIC SEPTICEMIA captures the relentless filth of 90s underground tape-trading goregrind."
    };
  } else {
    // Hardcore / Beatdown
    return {
      name: "CONCRETE SPITE",
      genre: "Hardcore / Heavy Beatdown",
      logoStyle: "hardcore_stencil",
      hometown: "Baltimore, MD / Wilkes-Barre, PA",
      label: "Cold Brick Records",
      tuning: "Drop F#",
      bpm: 170,
      timeSignature: "4/4 (Two-Step & Half-Time Mosh)",
      albumTitle: "BLOOD ON THE ASPHALT",
      releaseYear: 2026,
      albumConcept: "Unforgiving blue-collar fury, street-level retribution, stage dives, crowdkilling riffs, and brotherhood forged in pit blood.",
      artDescription: "Crumbling urban concrete wall sprayed with dripping red stencil graffiti, chainlink fencing, and barbed fist iconography.",
      recommendedArtStyle: "hardcore",
      members: [
        { role: "Frontman & Pit General", name: "Trey 'Bones' Kowalski", gear: "Cordless Shure Beta 58A, Bruised Knuckles" },
        { role: "Heavy Riff Enforcer", name: "Nico Ramos", gear: "Gibson Les Paul Custom, Peavey 5150 Full Stack" },
        { role: "Bass Slugger", name: "Dexter Vance", gear: "Fender Precision Bass, Ampeg SVT-CL 8x10" },
        { role: "Two-Step & Beatdown Drums", name: "Marcus Shaw", gear: "Tama Starclassic, Sabian AAX Cymbals" }
      ],
      tourDates: [
        { venue: "The Meatlocker", city: "Montclair, NJ", date: "OCT 19", supportingBands: ["Tough Luck", "Jawbreaker"] },
        { venue: "Amityville Music Hall", city: "Amityville, NY", date: "OCT 27", supportingBands: ["Final Warning"] },
        { venue: "First Unitarian Church", city: "Philadelphia, PA", date: "NOV 09", supportingBands: ["Pain of Truth", "Sunami"] }
      ],
      tracks: [
        {
          title: "Crowdkill Anthem",
          duration: "2:18",
          lyrics: "YOU TALKED YOUR TRASH BEHIND A SCREEN\nNOW YOU'RE STANDING IN MY F***ING PIT!\nMOVE!\n[TWO-STEP SECTION]\nTWO STEP FOR YOUR LIFE!\nNOW PICK IT UP!\n[BASS DROP]\nTHIS IS BALTIMORE HARDCORE!\n[BLEGH]\nGET THE F*** UP!",
          breakdownCallout: "DISRESPECT YOUR SURROUNDINGS!",
          riffTabs: "F#|-------------------------|\nC#|-------------------------|\nA |-------------------------|\nE |-------------------------|\nB |-------------------------|\nF#|-0-0-0--0-0-0--1-0-1-0-0-|",
          tempo: 165,
          timeSig: "4/4",
          riffSequence: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 2, 1],
          drumPattern: "two_step"
        },
        {
          title: "Vendetta (Iron Fist)",
          duration: "1:55",
          lyrics: "CROSS ME ONCE, SHAME ON YOU\nCROSS ME TWICE, YOU GET LAID OUT FLAT!\nWATCH YOUR BACK\nWHEN THE LIGHTS GO DOWN\nNO ESCAPE\nFROM THE CONCRETE!",
          breakdownCallout: "MOVE IT OR LOSE IT!",
          riffTabs: "F#|-0-1-0-0--0-1-0-0--0-3-2-1-|",
          tempo: 140,
          timeSig: "4/4",
          riffSequence: [0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 2, 1, 0, 0],
          drumPattern: "breakdown"
        },
        {
          title: "Spite Driven",
          duration: "2:40",
          lyrics: "EVERY DAY IS A BATTLEFIELD\nEVERY FRIEND HAS A PRICE TAG\nI WALK ALONE WITH CLENCHED TEETH\nNOTHING CAN BREAK ME NOW\nBREAKDOWN!",
          breakdownCallout: "KNOCK 'EM OUT!",
          riffTabs: "F#|-0---0---0---0---1-1-1-1-|",
          tempo: 130,
          timeSig: "4/4",
          riffSequence: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 4, 3, 0],
          drumPattern: "half_time_slam"
        }
      ],
      merchSlogan: "HEAVY BEATDOWN // STEP UP OR GET STEPPED ON",
      bio: "Formed in gritty industrial warehouses, CONCRETE SPITE blends 90s NYHC street discipline with skull-shattering modern beatdown breakdowns."
    };
  }
}

// Generate Band Lore, Tracks, Riffs, and Merch Specs using Gemini
app.post('/api/generate-band', async (req, res) => {
  try {
    const { subgenre, vibe, customName } = req.body;

    if (!aiClient) {
      console.log('No GEMINI_API_KEY detected, serving handcrafted heavy preset band.');
      return res.json(getMockBand(subgenre, vibe));
    }

    const prompt = `You are an elite producer and underground music historian specialized in Hardcore Punk, Grindcore, Powerviolence, Djent, Deathcore, and Mathcore.
Generate an authentic, high-impact extreme metal / hardcore / grindcore / djent band profile.

Input constraints:
- Requested Subgenre: ${subgenre || 'Choose between Djent, Grindcore, Deathcore, or Beatdown Hardcore'}
- Custom Vibe / Prompt: ${vibe || 'Brutal, raw, intense, authentic underground aesthetic'}
- Band Name Preference: ${customName || 'Create an incredible, evocative band name fitting the subgenre'}

Make sure:
1. Band name is striking, evocative, and fitting the subgenre (e.g. illegible grindcore style, cyber-technical djent, or brutal urban beatdown).
2. Tuning is authentic (e.g. Drop E 8-string, Drop F, Drop A, Drop C, Double Drop G).
3. BPM is realistic (Grindcore: 220-300+ BPM blast beats, Djent: 130-160 polyrhythms, Beatdown: 140-175 two-step and heavy slam).
4. Tracks include authentic metal lyrics with scream cues: [BLEGH], [GUTTURAL], [PIG SQUEAL], [BASS DROP], [TWO-STEP SECTION], [SLAM BREAKDOWN].
5. Tab riff sequence is an array of fret numbers on the lowest string (usually 0s for open chugs, 1, 2, 3, 5, 6 for heavy dissonant intervals like tritone/minor 2nd).
6. Merch concept, tour venues, band members with funny/authentic heavy gear.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the underground heavy music encyclopedia. Return accurate, culturally authentic hardcore/grindcore/djent band data in pristine JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            genre: { type: Type.STRING },
            logoStyle: { type: Type.STRING, description: "One of: grindcore_branches, djent_cyber_geom, hardcore_stencil, deathcore_dripping" },
            hometown: { type: Type.STRING },
            label: { type: Type.STRING },
            tuning: { type: Type.STRING },
            bpm: { type: Type.INTEGER },
            timeSignature: { type: Type.STRING },
            albumTitle: { type: Type.STRING },
            releaseYear: { type: Type.INTEGER },
            albumConcept: { type: Type.STRING },
            artDescription: { type: Type.STRING },
            recommendedArtStyle: { type: Type.STRING, description: "One of: djent, grindcore, hardcore" },
            merchSlogan: { type: Type.STRING },
            bio: { type: Type.STRING },
            members: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  name: { type: Type.STRING },
                  gear: { type: Type.STRING }
                },
                required: ["role", "name", "gear"]
              }
            },
            tourDates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  venue: { type: Type.STRING },
                  city: { type: Type.STRING },
                  date: { type: Type.STRING },
                  supportingBands: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["venue", "city", "date", "supportingBands"]
              }
            },
            tracks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  lyrics: { type: Type.STRING },
                  breakdownCallout: { type: Type.STRING },
                  riffTabs: { type: Type.STRING },
                  tempo: { type: Type.INTEGER },
                  timeSig: { type: Type.STRING },
                  riffSequence: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER }
                  },
                  drumPattern: { type: Type.STRING, description: "One of: polyrhythm_djent, blast_beat, two_step, breakdown, half_time_slam" }
                },
                required: ["title", "duration", "lyrics", "breakdownCallout", "riffTabs", "tempo", "timeSig", "riffSequence", "drumPattern"]
              }
            }
          },
          required: [
            "name", "genre", "logoStyle", "hometown", "label", "tuning", "bpm",
            "timeSignature", "albumTitle", "releaseYear", "albumConcept", "artDescription",
            "recommendedArtStyle", "merchSlogan", "bio", "members", "tourDates", "tracks"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating band:', error);
    res.json(getMockBand(req.body?.subgenre, req.body?.vibe));
  }
});

// Generate Custom Artwork via Gemini Image Model
app.post('/api/generate-artwork', async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!aiClient) {
      return res.status(400).json({ error: 'No GEMINI_API_KEY configured for image generation.' });
    }

    const enhancedPrompt = `Album cover art for an extreme ${style || 'metal'} band: ${prompt || 'Dark aggressive surreal album artwork, high contrast, cinematic gritty brutal atmosphere'}. Masterpiece heavy metal album sleeve. No watermarks.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let imageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      return res.json({ imageUrl });
    } else {
      return res.status(500).json({ error: 'No image generated in model response' });
    }
  } catch (error: any) {
    console.error('Error generating artwork:', error);
    return res.status(500).json({ error: error.message || 'Artwork generation failed' });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`BREAKDOWN Extreme Metal Server running on port ${port}`);
  });
}

startServer();
