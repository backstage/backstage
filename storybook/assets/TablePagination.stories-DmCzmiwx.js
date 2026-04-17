import{T as P}from"./TablePagination-B845fTkQ.js";import"./iframe-BemVm3iW.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DNY1z9xy.js";import"./index-CfKAs8sV.js";import"./Select-DlB5w98A.js";import"./Dialog-yHdRJ4XY.js";import"./Button-DUM7otWK.js";import"./utils-67UUfq9j.js";import"./Label-CfLV2GEV.js";import"./Hidden-PdwGn6CK.js";import"./useGlobalListeners-DjNZsfXO.js";import"./openLink-DsdV9ckj.js";import"./useLabel-BKeoaEj8.js";import"./useLabels-Cns4Y3S6.js";import"./number-BY_G_BRf.js";import"./I18nProvider-KlzMPuIO.js";import"./useButton-CPe_l3Qv.js";import"./usePress-CoePygci.js";import"./textSelection-ctslQtv7.js";import"./useHover-qzmeHD-I.js";import"./Heading-BqekBLXw.js";import"./useOverlayTriggerState-zZRCXjnL.js";import"./useControlledState-65WJWsue.js";import"./useCollection-ZwYVM1hp.js";import"./keyboard-hLGg7bG7.js";import"./FocusScope-BZlQ-oae.js";import"./useEvent-BrF9lIRf.js";import"./Autocomplete-D9aLX-8z.js";import"./useLocalizedStringFormatter-CJyK92B9.js";import"./getItemCount-CZHdzlqw.js";import"./Text-D4cNg7sI.js";import"./VisuallyHidden-C5KQiBDM.js";import"./animation-NzsbxN1_.js";import"./FieldError-Cm8-SYqK.js";import"./useFormValidation-B11nhLHh.js";import"./ListBox-CacS3SY5.js";import"./useListState-C3hlwa42.js";import"./useField-B3R_LXuf.js";import"./useFormReset-Bj_FEjdF.js";import"./definition-DS5e43gL.js";import"./useTextField-FpHEC6MB.js";import"./SearchField-DsIlANn3.js";import"./useFilter-BUkeHZ4m.js";import"./FieldLabel-4B3aYjfT.js";import"./FieldError-B1_hyNvG.js";import"./Text-Bdw4vaXh.js";import"./ButtonIcon-KY5U0EuZ.js";const p=()=>{},ge={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const me=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,me as __namedExportsOrder,ge as default};
