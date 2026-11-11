import{T as P}from"./TablePagination-Df0yZl8z.js";import"./iframe-CEdcshkh.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Cea8mF9S.js";import"./index-Bowgs7Nu.js";import"./Select-CDNevwtM.js";import"./BUIRoutingProvider-C_K9tmxr.js";import"./useFocusRing-CKR_B2iC.js";import"./Button-Cztc6Ql0.js";import"./utils-B3z3rPQ3.js";import"./Label-9Olhdt6S.js";import"./Hidden-nn8Lz43U.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./number-tjQdiso3.js";import"./I18nProvider-GWcSS_jn.js";import"./useButton-DltJ2Eig.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./getMetaValue-BMvIIQYf.js";import"./useHover-C0ptGV0J.js";import"./FieldError-Ry11NBFn.js";import"./Text-CBxuRi-e.js";import"./Form-C1TWgvPe.js";import"./useFormValidation-DNL4ciTO.js";import"./ListBox-CWJPYUhe.js";import"./useCollection-BY8b1dc1.js";import"./keyboard-CcJmHJZu.js";import"./FocusScope-BMlOaqzR.js";import"./useEvent-CrCFiZpU.js";import"./useControlledState-CY36eiiU.js";import"./useLoadMoreSentinel-DhzACs8q.js";import"./Autocomplete-0kwx_A17.js";import"./useLocalizedStringFormatter-Bt4wlDEw.js";import"./SelectionIndicator-A8NT-hkw.js";import"./useListState-Bk9MfIWW.js";import"./Dialog-p9B8nTzS.js";import"./Heading-BlKCRajT.js";import"./useOverlayTriggerState-BX1potNy.js";import"./VisuallyHidden-Co8SnzJt.js";import"./animation-NCXLQN6E.js";import"./useField-qlQhlPsk.js";import"./useFormReset-DV0mYMiO.js";import"./Input-4DhKHAbt.js";import"./SearchField-DA0clI6F.js";import"./useTextField-Do_qjUTZ.js";import"./useFilter-AT1z44Xq.js";import"./useCollectionAdapter-uhPMsEgi.js";import"./Avatar-BITFUyWI.js";import"./Skeleton-CP7QlAf-.js";import"./FieldLabel-B8qJhKl8.js";import"./FieldError-kJpnXvIp.js";import"./Popover-qKl9Nb-O.js";import"./Text-OK4ZkFhh.js";import"./ButtonIcon-Bk-ZEocg.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
