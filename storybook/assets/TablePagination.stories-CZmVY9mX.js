import{T as P}from"./TablePagination-DJFJXyf9.js";import"./iframe-Dl5_TB80.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C7LuogIC.js";import"./index-P6GXtDIS.js";import"./Select-Bx_vQr5V.js";import"./Dialog-CtkcVP0X.js";import"./Button-BREXngrn.js";import"./utils-DGkaMaF3.js";import"./Label-CwMshdGF.js";import"./Hidden-1cRpW4wa.js";import"./useGlobalListeners-CtaBTdJV.js";import"./openLink-k3Gx7yeJ.js";import"./useLabel-Bd4C7Sd8.js";import"./useLabels-CIaXcdIT.js";import"./number-CUJHByHy.js";import"./I18nProvider-DdxrthYO.js";import"./useButton-C9NVRh9l.js";import"./usePress-B21q6wEs.js";import"./textSelection-B7ezpFpp.js";import"./useHover-9E6EvIXl.js";import"./Heading-Bo0BxDrG.js";import"./useOverlayTriggerState-BxYmwbcD.js";import"./useControlledState-CbZzhw3I.js";import"./useCollection-B83xlPxw.js";import"./keyboard-9V0mj3_S.js";import"./FocusScope-CJwmhigo.js";import"./useEvent-CDdnj45Y.js";import"./Autocomplete-cPStGh3M.js";import"./useLocalizedStringFormatter-CkAdB0KW.js";import"./getItemCount-CYpe8tJx.js";import"./Text-CmmTld-Z.js";import"./VisuallyHidden-5kGZYaA8.js";import"./animation-Bq67aj6L.js";import"./FieldError-NLt2HR8A.js";import"./useFormValidation-DmmfnNyV.js";import"./ListBox-BusgxILK.js";import"./useListState-CLGPtH8Y.js";import"./useField-DlYL5pdu.js";import"./useFormReset-BLjeDNKm.js";import"./definition-DG6iwMyM.js";import"./Input-4WNFixI8.js";import"./SearchField-CUQx6DeP.js";import"./useTextField-i2xYGhQB.js";import"./useFilter-D5huGqo5.js";import"./FieldLabel-IN8e_Sly.js";import"./FieldError-CxvdAmZA.js";import"./Text-XofFIW7_.js";import"./ButtonIcon-DTrPE6KP.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
