import json, struct
from pathlib import Path

path = Path(r"public/models/showroom.glb")
with open(path, "rb") as f:
    magic = f.read(4)
    version = struct.unpack("<I", f.read(4))[0]
    length = struct.unpack("<I", f.read(4))[0]
    chunk0_len = struct.unpack("<I", f.read(4))[0]
    chunk0_type = f.read(4)
    chunk0 = f.read(chunk0_len)
    gltf = json.loads(chunk0)

sphere_node = gltf["nodes"][1]  # Sphere node
print("Sphere node:")
print(f"  translation: {sphere_node.get('translation', [0,0,0])}")
print(f"  rotation: {sphere_node.get('rotation', [0,0,0,1])}")
print(f"  scale: {sphere_node.get('scale', [1,1,1])}")
print(f"  mesh: {sphere_node.get('mesh')}")

camera_node = gltf["nodes"][2]  # Camera_Export node
print("\nCamera_Export node:")
print(f"  translation: {camera_node.get('translation', [0,0,0])}")
print(f"  rotation: {camera_node.get('rotation', [0,0,0,1])}")
print(f"  scale: {camera_node.get('scale', [1,1,1])}")
print(f"  camera: {camera_node.get('camera')}")
