/**
 * Created by skyxu on 2019/11/27.
 * 适用于ccc2.x版本
 */

const Effect = {
    Gray: 'Gray',  // 置灰
    Normal: 'Normal',  //
    Bright: 'Bright',  //
};

cc.Class({
    extends: cc.Component,

    statics: {
        Effect: Effect,

        Shader: {
            'Normal': {vert_web: 'Default_noMVP_vert', vert_native: 'Default_noMVP_vert', frag: 'Normal_frag'},
            'Gray': {vert_web: 'Default_noMVP_vert', vert_native: 'Default_noMVP_vert', frag: 'Gray_frag'},
            'Bright': {vert_web: 'Default_noMVP_vert', vert_native: 'Default_noMVP_vert', frag: 'Bright_frag'},
        },


        init: function () {
            // programs
            this.shaderPrograms = {};
        },


        // 2.x版本引擎需要改成使用material
        setShader: function (renderComp, shaderName) {
            if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                return;
            }
            let materialName = '';
            if (shaderName == Effect.Normal) {
                materialName = '2d-sprite';
            } else if (shaderName == Effect.Gray) {
                materialName = '2d-gray-sprite';
            } else if (shaderName == Effect.Bright) {
                materialName = '2d-bright-sprite';
            }
            let material = cc.Material.getBuiltinMaterial(materialName);
            if (material) {
                material = cc.Material.getInstantiatedMaterial(material, renderComp);
                renderComp.setMaterial(0, material);
            } else {
                cc.log("ShaderUtils: matrial: " + shaderName + " is not exsit");
            }
        },


        // ------以下为1.x版本引擎使用------
        // setShader: function (component, shaderName) {
        //     if (!component || !this.Shader[shaderName]) {
        //         return;
        //     }
        //     let glProgram = this.shaderPrograms[shaderName];
        //     if (!glProgram) {
        //         let shaderCfg = this.Shader[shaderName];
        //         let vert = null;
        //         if (cc.sys.isNative) {
        //             vert = require(shaderCfg.vert_native);
        //         } else {
        //             vert = require(shaderCfg.vert_web);
        //         }
        //         let frag = require(shaderCfg.frag);
        //         glProgram = this.getGlPropgram(vert, frag);
        //         this.shaderPrograms[shaderName] = glProgram;
        //     }
        //
        //     this.setProgram(component, glProgram);
        // },
        //
        // setProgram:function (component, glProgram) {
        //     if (cc.sys.isNative) {
        //         var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
        //         if (component) {
        //             component.setGLProgramState(glProgram_state);
        //         }
        //     } else {
        //         if (component) {
        //             component.setShaderProgram(glProgram);
        //         }
        //     }
        // },
        //
        // getGlPropgram: function(vert, frag) {
        //     var glProgram = new cc.GLProgram();
        //
        //     if (cc.sys.isNative) {
        //         glProgram.initWithString(vert, frag);
        //     } else {
        //         glProgram.initWithVertexShaderByteArray(vert, frag);
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        //         glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        //     }
        //     glProgram.link();
        //     glProgram.updateUniforms();
        //     return glProgram;
        // },
    },
});
