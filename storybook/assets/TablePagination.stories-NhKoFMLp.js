import{T as P}from"./TablePagination-C20Yn6dH.js";import"./iframe-CixUC8j1.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-ZdsVGe-3.js";import"./index-CMV6OJRm.js";import"./Select-BUB-4THb.js";import"./Button-CeKECDlo.js";import"./utils-C0RYu6E0.js";import"./Label-C5NXX0n-.js";import"./Hidden-BWMUkUTp.js";import"./useFocusRing-CitxrkAs.js";import"./openLink-D1LWGCtX.js";import"./useLabel-D_XETIfd.js";import"./useLabels-Dy-UjWsQ.js";import"./number-CoVgoHrl.js";import"./I18nProvider-BvzqfVc8.js";import"./useButton-4XVXMs9M.js";import"./usePress-DrmMjR9D.js";import"./textSelection-BvqPUlaX.js";import"./getMetaValue-B3Np7h3R.js";import"./useHover-BFydUWI5.js";import"./FieldError-BipE4jLN.js";import"./Text-DSi2Eais.js";import"./Form-CLTaEjkT.js";import"./useFormValidation-DC8UOFrP.js";import"./ListBox-CqcznEUs.js";import"./useCollection-gPsam2QN.js";import"./keyboard-molnQt7o.js";import"./FocusScope-CD-GhFaj.js";import"./useEvent-C-wkqXQM.js";import"./useControlledState-BB9FqNcJ.js";import"./useLoadMoreSentinel-A9SDrznF.js";import"./Autocomplete-Cr1IQX1D.js";import"./useLocalizedStringFormatter-B4ycpP_5.js";import"./SelectionIndicator-DXC7w3au.js";import"./useListState-BYHLTueY.js";import"./Dialog-sg5ERGZf.js";import"./Heading-DbMoIYcC.js";import"./useOverlayTriggerState-qIPRLIZl.js";import"./VisuallyHidden-xPl_TYsU.js";import"./animation-D2Z_ye8z.js";import"./useField-DmhZx5df.js";import"./useFormReset-qN1ETd3H.js";import"./Input-UXwc57E1.js";import"./SearchField-4c5TYqV1.js";import"./useTextField-D8zAFltw.js";import"./useFilter-DzOKZXug.js";import"./useCollectionAdapter-kTNzdafA.js";import"./Avatar-EqQtRVnr.js";import"./Skeleton-CwnodnMR.js";import"./FieldLabel-CywsEpin.js";import"./FieldError-Dz790hUV.js";import"./Popover-Drn2IFTy.js";import"./Text-BftnOUfi.js";import"./ButtonIcon-Dzi62hqC.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
