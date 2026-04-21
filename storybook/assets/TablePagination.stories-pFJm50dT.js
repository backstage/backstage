import{T as P}from"./TablePagination-CJPmVSIH.js";import"./iframe-V0mCSmm6.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Ds30v8Tp.js";import"./index-B_QuoT2r.js";import"./Select-B69JR_TG.js";import"./Dialog-DAkoVP0H.js";import"./Button-iv42sllk.js";import"./utils-BDE85oZ4.js";import"./Label-Cr8bMF7C.js";import"./Hidden-CLW6bt9s.js";import"./useGlobalListeners-CKMdmYgV.js";import"./openLink-C69Yx9MB.js";import"./useLabel-CR4CoWQK.js";import"./useLabels-Bih5Ckwh.js";import"./number-DAvCLclB.js";import"./I18nProvider-mLa6b5wO.js";import"./useButton-Cz5c6zxA.js";import"./usePress-CfPKhABG.js";import"./textSelection-UrLfp6UX.js";import"./useHover-CFiSx20A.js";import"./Heading-7rs29LLS.js";import"./useOverlayTriggerState-Ce3GaTDJ.js";import"./useControlledState-MEnSdpzT.js";import"./useCollection-CMnOmfnB.js";import"./keyboard-DADT6wG6.js";import"./FocusScope-Bqg3Wzq4.js";import"./useEvent-EHtBNGAY.js";import"./Autocomplete-Csj1k8WT.js";import"./useLocalizedStringFormatter-C-gNs3QG.js";import"./getItemCount-DxOT-chG.js";import"./Text-Cn_gwYjP.js";import"./VisuallyHidden-BsZWsydh.js";import"./animation-3zA3LL0n.js";import"./FieldError-dAo41XPK.js";import"./useFormValidation-B26hhFpA.js";import"./ListBox-lJUPLbn3.js";import"./useListState-BR2USGJH.js";import"./useField-DGxVmDro.js";import"./useFormReset-CId3_isl.js";import"./definition-D1I4KHzY.js";import"./Input-DjPZTvBH.js";import"./SearchField-DlroSFPQ.js";import"./useTextField-CFEosqmY.js";import"./useFilter-CkyI0LjT.js";import"./FieldLabel-DU7PdygQ.js";import"./FieldError-DHYjLTJm.js";import"./Text-n94Xqs2F.js";import"./ButtonIcon-CHCJUS0S.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
