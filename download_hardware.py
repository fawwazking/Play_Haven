import os
import urllib.request
import json
import urllib.parse

CONSOLES_DIR = r"C:\Sem5\E Commerce\PlayHaven\frontend\public\images\consoles"
os.makedirs(CONSOLES_DIR, exist_ok=True)

USER_AGENT = "PlayHavenAcademicBot/1.0 (contact: fawwazwijdan19@gmail.com)"
headers = {'User-Agent': USER_AGENT}

# Target file Wikipedia untuk konsol & controller resmi
WIKI_HARDWARE_FILES = [
    # Consoles
    ("ps5-console.png", "File:PlayStation_5_and_DualSense_with_transparent_background.png"),
    ("ps4-pro-console.png", "File:PS4-Console-wDualShock4.png"),
    ("ps3-console.png", "File:Sony-PlayStation-3-CECHA01-wController-L.png"),
    ("xbox-series-x-console.png", "File:Xbox-Series-X-Set.png"),
    ("xbox-one-s-console.png", "File:Microsoft-Xbox-One-S-Console-wController-FL.png"),
    ("switch-oled-console.png", "File:Nintendo-Switch-wJoyCons-BlRd-Standing-FL.png"),
    ("wii-u-console.png", "File:Wii_U_Console_and_Gamepad.png"),
    
    # Controllers / Accessories
    ("dualsense-controller.png", "File:DualSense_Transp.png"),
    ("xbox-controller.png", "File:Xbox_Series_X_Controller.png"),
    ("switch-pro-controller.png", "File:Nintendo-Switch-Pro-Controller-FL.png")
]

for filename, wiki_title in WIKI_HARDWARE_FILES:
    outpath = os.path.join(CONSOLES_DIR, filename)
    if os.path.exists(outpath) and os.path.getsize(outpath) > 5000:
        print(f"ALREADY EXISTS: {filename}")
        continue
    
    i_api = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
    req_i = urllib.request.Request(i_api, headers=headers)
    try:
        with urllib.request.urlopen(req_i) as r_i:
            id_data = json.loads(r_i.read().decode('utf-8'))
        for _, page in id_data.get('query', {}).get('pages', {}).items():
            if 'imageinfo' in page and page['imageinfo']:
                u = page['imageinfo'][0]['url']
                req_dl = urllib.request.Request(u, headers=headers)
                with urllib.request.urlopen(req_dl) as dl_resp:
                    with open(outpath, 'wb') as f:
                        f.write(dl_resp.read())
                print(f"SUCCESS DOWNLOADED: {filename} ({os.path.getsize(outpath)} bytes)")
                break
            else:
                print(f"NO IMAGEINFO for {wiki_title}")
    except Exception as e:
        print(f"ERROR {filename}: {e}")
