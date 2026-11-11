import{T as P}from"./TablePagination-DTlSO12r.js";import"./iframe-CIT-dZu_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B4D9CzQM.js";import"./index-C4qi6jZX.js";import"./Select-Bbnoq2VB.js";import"./BUIRoutingProvider-6gcgcyzR.js";import"./useFocusRing-ByVMGaNA.js";import"./Button-BzxePFvu.js";import"./utils-3SfRWDXk.js";import"./Label-BoyMwewe.js";import"./Hidden-paCviALj.js";import"./useLabel-Cq-2nnHJ.js";import"./useLabels-BEUaVICg.js";import"./number-BCBVXMPD.js";import"./I18nProvider-CmgCSkj9.js";import"./useButton-B66KWxu2.js";import"./usePress-BOnalXjM.js";import"./textSelection-aEjP62Wo.js";import"./getMetaValue-SvU3Wp5k.js";import"./useHover-tuK_rbDS.js";import"./FieldError-o5djUeGf.js";import"./Text-CzkJILey.js";import"./Form-bWXWc4sj.js";import"./useFormValidation-oa4sjkgN.js";import"./ListBox-BFhTPBUb.js";import"./useCollection-BUaSHk5y.js";import"./keyboard-BWVXbNVx.js";import"./FocusScope-BRVILLR6.js";import"./useEvent-NLk_1-hY.js";import"./useControlledState-Bo32Yv4j.js";import"./useLoadMoreSentinel-DzkxUf7S.js";import"./Autocomplete-NZhbccUZ.js";import"./useLocalizedStringFormatter-Ck0tckSr.js";import"./SelectionIndicator-tggTf9VM.js";import"./useListState-_Y2jui6D.js";import"./Dialog-I5_bxuwD.js";import"./Heading-xjtrGHLX.js";import"./useOverlayTriggerState-B26sLsFg.js";import"./VisuallyHidden-C5NMUpy-.js";import"./animation-pATfZ50U.js";import"./useField-CyrTSk-V.js";import"./useFormReset-BxKhZo52.js";import"./Input-BIjePdm2.js";import"./SearchField-BRGZJJx-.js";import"./useTextField-DpnlZvWg.js";import"./useFilter-BbOUNcGe.js";import"./useCollectionAdapter--yrVY8u8.js";import"./Avatar-DzLwGoHW.js";import"./Skeleton-CwYXJJcq.js";import"./FieldLabel-cZue7VEP.js";import"./FieldError-CWPMLAXJ.js";import"./Popover-prGiLman.js";import"./Text-BZ7yrAUT.js";import"./ButtonIcon-CoxYVv_r.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
