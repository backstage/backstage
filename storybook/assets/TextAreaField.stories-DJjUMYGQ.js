import{aO as L,r as h,aP as S,j as e,p as q}from"./iframe-D5t0zV2Z.js";import{$ as v,a as D}from"./TextField-BAG-f8EB.js";import{F as j}from"./FieldLabel-Cw1GZHoI.js";import{F as R}from"./FieldError-DH87wofE.js";import{$}from"./Form-RnyeY1Wv.js";import{F as P}from"./Flex-B_Db5ot6.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-C39--9xx.js";import"./useObjectRef-kGsiECgS.js";import"./FieldError-BufNcm74.js";import"./Text--erJL1eo.js";import"./Hidden-Dsa08sWj.js";import"./useFocusRing-vtWZMyzl.js";import"./openLink-DJ_oJLh5.js";import"./Autocomplete-C2BxSGXK.js";import"./keyboard-vsvxufhh.js";import"./getMetaValue-lPtVOvv4.js";import"./useEvent-Ky4nwph9.js";import"./useLabels-D8GfqFut.js";import"./useLocalizedStringFormatter-Dq7SKV2-.js";import"./I18nProvider-CnCaeKRg.js";import"./useControlledState-CWsOmoBN.js";import"./Input-B8KQxdZr.js";import"./useHover-CMgWw-jG.js";import"./Label-DaItaSZn.js";import"./useTextField-BqFVkvRL.js";import"./useField-B9NwoH1a.js";import"./useLabel-32i4SIb0.js";import"./useFormReset-B281acCK.js";import"./useFormValidation-DF0-wOxW.js";const W={"bui-TextAreaField":"_bui-TextAreaField_1ghu6_20","bui-TextArea":"_bui-TextArea_1ghu6_20"},_=L()({styles:W,classNames:{root:"bui-TextAreaField",textArea:"bui-TextArea"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},className:{},placeholder:{},rows:{default:3},label:{},description:{},secondaryLabel:{}}}),n=h.forwardRef((s,c)=>{const{ownProps:f,restProps:i,dataAttributes:b}=S(_,s),{classes:x,label:g,secondaryLabel:y,placeholder:F,description:T,rows:w}=f;h.useEffect(()=>{!g&&!i["aria-label"]&&!i["aria-labelledby"]&&console.warn("TextAreaField requires either a visible label, aria-label, or aria-labelledby for accessibility")},[g,i["aria-label"],i["aria-labelledby"]]);const A=y||(i.isRequired?"Required":null);return e.jsxs(v,{className:x.root,...b,...i,ref:c,children:[e.jsx(j,{label:g,secondaryLabel:A,description:T,descriptionSlot:"description"}),e.jsx(D,{className:x.textArea,"data-size":b["data-size"],placeholder:F,rows:w}),e.jsx(R,{})]})});n.displayName="TextAreaField";n.__docgenInfo={description:`A multi-line text input with an integrated label and inline error display.

@public`,methods:[],displayName:"TextAreaField",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the text area field
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"Text to display in the text area when it has no value"},rows:{required:!1,tsType:{name:"number"},description:`The number of visible text lines, controlling the initial and minimum height
@defaultValue 3`},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const r=q.meta({title:"Backstage UI/TextAreaField",component:n,argTypes:{isRequired:{control:"boolean"}}}),t=r.story({args:{name:"message",placeholder:"Enter a message",style:{maxWidth:"300px"}}}),a=r.story({args:{...t.input.args,label:"Message"}}),l=r.story({args:{...a.input.args,description:"Share as much detail as you like."}}),o=r.story({args:{...a.input.args,isRequired:!0}}),m=r.story({args:{...t.input.args,isDisabled:!0}}),p=r.story({args:{...t.input.args},render:s=>e.jsxs(P,{direction:"column",gap:"4",style:{maxWidth:"300px"},children:[e.jsx(n,{...s,size:"small",label:"Small"}),e.jsx(n,{...s,size:"medium",label:"Medium"})]})}),d=r.story({args:{...a.input.args,rows:3,defaultValue:Array.from({length:12},(s,c)=>`Line ${c+1}: this content scrolls within a fixed height.`).join(`
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
