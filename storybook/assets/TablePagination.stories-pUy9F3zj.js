import{T as P}from"./TablePagination-i2mHYw_3.js";import"./iframe-Cz6SWQVH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B1XDxt8o.js";import"./index-B8gNhpoB.js";import"./Select-DoFXNtNd.js";import"./Dialog-DKcVkm3s.js";import"./Button-DG_lt24t.js";import"./utils-DdYDv1my.js";import"./Label-ZZaSZ0gq.js";import"./Hidden-DyqXWYJG.js";import"./useGlobalListeners-_pWc5lzW.js";import"./openLink-yrE7vS55.js";import"./useLabel-C4-PSEwD.js";import"./useLabels-CCt0vcrF.js";import"./number-UJKiLYay.js";import"./I18nProvider-ChnkasvC.js";import"./useButton-rOnnSkgn.js";import"./usePress-BeBtVFaO.js";import"./textSelection-CYg68ItS.js";import"./useHover-LSx6rYV4.js";import"./Heading-oZV7ajQ9.js";import"./useOverlayTriggerState-B5OTrc4C.js";import"./useControlledState-DIn6soyg.js";import"./useCollection-CLMIp0SM.js";import"./keyboard-DV3FDKrT.js";import"./FocusScope-BV-ICilT.js";import"./useEvent-Clq4kWZo.js";import"./Autocomplete-8q4gaT1h.js";import"./useLocalizedStringFormatter-BUNlf1KX.js";import"./getItemCount-BLULPfOg.js";import"./Text-BGEAm46S.js";import"./VisuallyHidden-BXPZyn_f.js";import"./animation-BcNqkzOv.js";import"./FieldError-Cc3YzjP5.js";import"./useFormValidation-D_7zkheX.js";import"./ListBox-BOJ6oMAq.js";import"./useListState-ryLfoNuF.js";import"./useField-CoFUr6lr.js";import"./useFormReset-B0RXVB7U.js";import"./definition-DzAGX08B.js";import"./useTextField-C49JtK49.js";import"./SearchField-ksHvgZAe.js";import"./useFilter-4KlvbgY_.js";import"./FieldLabel-8ShpkUNn.js";import"./FieldError-DLGcm5AL.js";import"./Text-tYPEUn0s.js";import"./ButtonIcon-BXF_n26-.js";const p=()=>{},ge={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
