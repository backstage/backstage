import{T as P}from"./TablePagination-HealyfSL.js";import"./iframe-B7ESvRaB.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Dd7TU9CZ.js";import"./index-DbP8Hxod.js";import"./Select-Nu-xIr_3.js";import"./Dialog-B8ZfYxUf.js";import"./Button-CkPxspJE.js";import"./utils-Cr8yviUJ.js";import"./Label-B06uCzgg.js";import"./Hidden-CK51uwW5.js";import"./useGlobalListeners-DQLyYZ9f.js";import"./openLink-BFNE09ao.js";import"./useLabel-4lo-IT0x.js";import"./useLabels-CZf5BL8e.js";import"./number-DKEC05wv.js";import"./I18nProvider-BeIWmuaR.js";import"./useButton-DtXFNKA5.js";import"./usePress-HRSvR9KN.js";import"./textSelection-XuXSjEvl.js";import"./useHover-ByBQ7Oss.js";import"./Heading-CAK7K7Ei.js";import"./useOverlayTriggerState-BQI29lrc.js";import"./useControlledState-CAbD27ky.js";import"./useCollection-BY8iat3j.js";import"./keyboard-D5YIFYbX.js";import"./FocusScope-BH80Flu8.js";import"./useEvent-DHH67uGj.js";import"./Autocomplete-CNmEvmEM.js";import"./useLocalizedStringFormatter-DDwB1B3c.js";import"./getItemCount-DH8ckQTJ.js";import"./Text-DRd6SIAI.js";import"./VisuallyHidden-BCbZC_pS.js";import"./animation-Dck7a-0Y.js";import"./FieldError-eB_pr8Wa.js";import"./useFormValidation-b6a5_FZR.js";import"./ListBox-Dy1BN8xK.js";import"./useListState-Dp5LXYnH.js";import"./useField-BUR4AR8N.js";import"./useFormReset-Cx4bKIVX.js";import"./definition-C4-00mRM.js";import"./useTextField-Cr00JWXn.js";import"./SearchField-CNcmfNuo.js";import"./useFilter-BTettxGt.js";import"./FieldLabel-CxtMnHOM.js";import"./FieldError-BR-r3kZi.js";import"./Text-2w665EoO.js";import"./ButtonIcon-Be6gXqqZ.js";const p=()=>{},ge={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
