import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three-stdlib";

let ktx2Loader: KTX2Loader | null = null;

export function useGLTFWithKTX2(path: string) {
  const { gl } = useThree();

  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/basis/");
  }

  return useGLTF(path, true, true, (loader: any) => {
    loader.setKTX2Loader(ktx2Loader!.detectSupport(gl));
  });
}
