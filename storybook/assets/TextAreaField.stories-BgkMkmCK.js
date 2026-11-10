import{aN as L,r as f,aO as S,j as e,p as q}from"./iframe-CixUC8j1.js";import{$ as v,a as D}from"./TextField-CmV0Lw2G.js";import{F as j}from"./FieldLabel-CywsEpin.js";import{F as R}from"./FieldError-Dz790hUV.js";import{$}from"./Form-CLTaEjkT.js";import{F as W}from"./Flex-CKuSwZsR.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C0RYu6E0.js";import"./useObjectRef-ZdsVGe-3.js";import"./FieldError-BipE4jLN.js";import"./Text-DSi2Eais.js";import"./Hidden-BWMUkUTp.js";import"./useFocusRing-CitxrkAs.js";import"./openLink-D1LWGCtX.js";import"./Autocomplete-Cr1IQX1D.js";import"./keyboard-molnQt7o.js";import"./getMetaValue-B3Np7h3R.js";import"./useEvent-C-wkqXQM.js";import"./useLabels-Dy-UjWsQ.js";import"./useLocalizedStringFormatter-B4ycpP_5.js";import"./I18nProvider-BvzqfVc8.js";import"./useControlledState-BB9FqNcJ.js";import"./Input-UXwc57E1.js";import"./useHover-BFydUWI5.js";import"./Label-C5NXX0n-.js";import"./useTextField-D8zAFltw.js";import"./useField-DmhZx5df.js";import"./useLabel-D_XETIfd.js";import"./useFormReset-qN1ETd3H.js";import"./useFormValidation-DC8UOFrP.js";const _={"bui-TextAreaField":"_bui-TextAreaField_109oe_20","bui-TextArea":"_bui-TextArea_109oe_20"},z=L()({styles:_,classNames:{root:"bui-TextAreaField",textArea:"bui-TextArea"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},className:{},placeholder:{},rows:{default:3},label:{},description:{},secondaryLabel:{}}}),n=f.forwardRef((s,c)=>{const{ownProps:h,restProps:i,dataAttributes:b}=S(z,s),{classes:x,label:g,secondaryLabel:y,placeholder:F,description:T,rows:w}=h;f.useEffect(()=>{!g&&!i["aria-label"]&&!i["aria-labelledby"]&&console.warn("TextAreaField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[g,i["aria-label"],i["aria-labelledby"]]);const A=y||(i.isRequired?"Required":null);return e.jsxs(v,{className:x.root,...b,...i,ref:c,children:[e.jsx(j,{label:g,secondaryLabel:A,description:T,descriptionSlot:"description"}),e.jsx(D,{className:x.textArea,"data-size":b["data-size"],placeholder:F,rows:w}),e.jsx(R,{})]})});n.displayName="TextAreaField";n.__docgenInfo={description:`A multi-line text input with an integrated label and inline error display.

@public`,methods:[],displayName:"TextAreaField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text area field
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the text area when it has no value"},rows:{required:!1,tsType:{name:"number"},description:`The number of visible text lines, controlling the initial and minimum height
@defaultValue 3`},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const r=q.meta({title:"Backstage UI/TextAreaField",component:n,argTypes:{isRequired:{control:"boolean"}}}),t=r.story({args:{name:"message",placeholder:"Enter a message",style:{maxWidth:"300px"}}}),a=r.story({args:{...t.input.args,label:"Message"}}),l=r.story({args:{...a.input.args,description:"Share as much detail as you like."}}),o=r.story({args:{...a.input.args,isRequired:!0}}),m=r.story({args:{...t.input.args,isDisabled:!0}}),p=r.story({args:{...t.input.args},render:s=>e.jsxs(W,{direction:"column",gap:"4",style:{maxWidth:"300px"},children:[e.jsx(n,{...s,size:"small",label:"Small"}),e.jsx(n,{...s,size:"medium",label:"Medium"})]})}),d=r.story({args:{...a.input.args,rows:3,defaultValue:Array.from({length:12},(s,c)=>`Line ${c+1}: this content scrolls within a fixed height.`).join(`
`)}}),u=r.story({args:{...a.input.args},render:s=>e.jsx($,{validationErrors:{message:"Message is required"},children:e.jsx(n,{...s})})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    name: 'message',
    placeholder: 'Enter a message',
    style: {
      maxWidth: '300px'
    }
  }
})`,...t.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    label: 'Message'
  }
})`,...a.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    description: 'Share as much detail as you like.'
  }
})`,...l.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    isRequired: true
  }
})`,...o.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    isDisabled: true
  }
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column" gap="4" style={{
    maxWidth: '300px'
  }}>
      <TextAreaField {...args} size="small" label="Small" />
      <TextAreaField {...args} size="medium" label="Medium" />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args,
    rows: 3,
    defaultValue: Array.from({
      length: 12
    }, (_, i) => \`Line \${i + 1}: this content scrolls within a fixed height.\`).join('\\n')
  }
})`,...d.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...WithLabel.input.args
  },
  render: args => <Form validationErrors={{
    message: 'Message is required'
  }}>
      <TextAreaField {...args} />
    </Form>
})`,...u.input.parameters?.docs?.source}}};const de=["Default","WithLabel","WithDescription","Required","Disabled","Sizes","Scrolling","ShowError"];export{t as Default,m as Disabled,o as Required,d as Scrolling,u as ShowError,p as Sizes,l as WithDescription,a as WithLabel,de as __namedExportsOrder};
