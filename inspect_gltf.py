import json, gzip, struct
from pathlib import Path

path = Path(r"public/models/showroom.glb")
with open(path, "rb") as f:
    magic = f.read(4)
    version = struct.unpack("<I", f.read(4))[0]
    length = struct.unpack("<I", f.read(4))[0]
    print(f"magic: {magic}, version: {version}, length: {length}")
    
    chunk0_len = struct.unpack("<I", f.read(4))[0]
    chunk0_type = f.read(4)
    chunk0 = f.read(chunk0_len)
    gltf = json.loads(chunk0)

# Print key sections
print("\n=== NODES ===")
for i, node in enumerate(gltf.get("nodes", [])):
    print(f"  [{i}] {node.get('name', '<unnamed>')}: children={node.get('children', [])}")

print("\n=== MESHES ===")
for i, mesh in enumerate(gltf.get("meshes", [])):
    print(f"  [{i}] {mesh.get('name', '<unnamed>')}")

print("\n=== CAMERAS ===")
for i, cam in enumerate(gltf.get("cameras", [])):
    print(f"  [{i}] {cam.get('name', '<unnamed>')}: {cam}")

print("\n=== ANIMATIONS ===")
for i, anim in enumerate(gltf.get("animations", [])):
    print(f"  [{i}] {anim.get('name', '<unnamed>')}")
    for ch in anim.get("channels", []):
        sampler = anim["samplers"][ch["sampler"]]
        target = ch["target"]
        node_idx = target.get("node", "N/A")
        node_name = gltf["nodes"][node_idx]["name"] if node_idx != "N/A" and node_idx < len(gltf.get("nodes", [])) else "N/A"
        print(f"    -> node[{node_idx}] ({node_name}) path={target.get('path')}, interpolation={sampler.get('interpolation')}")
    # Get duration
    max_time = 0
    for s in anim.get("samplers", []):
        acc = gltf["accessors"][s["input"]]
        max_time = max(max_time, acc.get("max", [0])[0])
    print(f"    duration: {max_time}s = {max_time * 24} frames @ 24fps")

print("\n=== SCENE ROOT ===")
for i, scene in enumerate(gltf.get("scenes", [])):
    print(f"  scene[{i}] nodes: {scene.get('nodes', [])}")
