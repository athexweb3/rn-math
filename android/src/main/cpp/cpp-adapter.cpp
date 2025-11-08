#include <jni.h>
#include "NitroRnMathOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::rnmath::initialize(vm);
}
