#include <jni.h>
#include "RnMathOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::rnmath::initialize(vm);
}
