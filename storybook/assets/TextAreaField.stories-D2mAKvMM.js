import{bg as L,ca as h,cH as S,bR as e,c7 as q}from"./iframe-COykYx45.js";import{$ as v,a as D}from"./TextField-BPmlKeeP.js";import{F as R}from"./FieldLabel-D0qHGXY9.js";import{F as j}from"./FieldError-BKd5KLE1.js";import{a as W}from"./useFormValidation-DaDBy4-y.js";import{F as _}from"./Flex-D2MkoDKN.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-ijm_b3mJ.js";import"./useObjectRef-CMiC6ke_.js";import"./FieldError-BP5SOq7I.js";import"./Text-slD25mVU.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./Autocomplete-BCll0Usm.js";import"./keyboard-C7oGs8Ux.js";import"./useEvent-Dn5dWHRg.js";import"./useLabels-Cpdv89rG.js";import"./useLocalizedStringFormatter-BGJNBy6y.js";import"./I18nProvider-DL1Ps6Ca.js";import"./useControlledState-CjsdyDjY.js";import"./Input-ye45j2AX.js";import"./useHover-gDb7vOkJ.js";import"./Hidden-BsQlbI9F.js";import"./Label--YQs_5DF.js";import"./useTextField-afr60wi8.js";import"./useField-Capgz0XH.js";import"./useLabel-PGKREU8T.js";import"./useFormReset-DHQFUW9B.js";const $={"bui-TextAreaField":"_bui-TextAreaField_1ghu6_20","bui-TextArea":"_bui-TextArea_1ghu6_20"},z=L()({styles:$,classNames:{root:"bui-TextAreaField",textArea:"bui-TextArea"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},className:{},placeholder:{},rows:{default:3},label:{},description:{},secondaryLabel:{}}}),n=h.forwardRef((s,c)=>{const{ownProps:f,restProps:i,dataAttributes:b}=S(z,s),{classes:x,label:g,secondaryLabel:y,placeholder:F,description:T,rows:w}=f;h.useEffect(()=>{!g&&!i["aria-label"]&&!i["aria-labelledby"]&&console.warn("TextAreaField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[g,i["aria-label"],i["aria-labelledby"]]);const A=y||(i.isRequired?"Required":null);return e.jsxs(v,{className:x.root,...b,...i,ref:c,children:[e.jsx(R,{label:g,secondaryLabel:A,description:T,descriptionSlot:"description"}),e.jsx(D,{className:x.textArea,"data-size":b["data-size"],placeholder:F,rows:w}),e.jsx(j,{})]})});n.displayName="TextAreaField";n.__docgenInfo={description:`A multi-line text input with an integrated label and inline error display.

@public`,methods:[],displayName:"TextAreaField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text area field
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the text area when it has no value"},rows:{required:!1,tsType:{name:"number"},description:`The number of visible text lines, controlling the initial and minimum height
@defaultValue 3`},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const r=q.meta({title:"Backstage UI/TextAreaField",component:n,argTypes:{isRequired:{control:"boolean"}}}),t=r.story({args:{name:"message",placeholder:"Enter a message",style:{maxWidth:"300px"}}}),a=r.story({args:{...t.input.args,label:"Message"}}),l=r.story({args:{...a.input.args,description:"Share as much detail as you like."}}),o=r.story({args:{...a.input.args,isRequired:!0}}),m=r.story({args:{...t.input.args,isDisabled:!0}}),p=r.story({args:{...t.input.args},render:s=>e.jsxs(_,{direction:"column",gap:"4",style:{maxWidth:"300px"},children:[e.jsx(n,{...s,size:"small",label:"Small"}),e.jsx(n,{...s,size:"medium",label:"Medium"})]})}),d=r.story({args:{...a.input.args,rows:3,defaultValue:Array.from({length:12},(s,c)=>`Line ${c+1}: this content scrolls within a fixed height.`).join(`
`)}}),u=r.story({args:{...a.input.args},render:s=>e.jsx(W,{validationErrors:{message:"Message is required"},children:e.jsx(n,{...s})})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const me=["Default","WithLabel","WithDescription","Required","Disabled","Sizes","Scrolling","ShowError"];export{t as Default,m as Disabled,o as Required,d as Scrolling,u as ShowError,p as Sizes,l as WithDescription,a as WithLabel,me as __namedExportsOrder};
