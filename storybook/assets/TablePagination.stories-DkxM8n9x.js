import{T as P}from"./TablePagination-SQvWm-02.js";import"./iframe-SO2aIStn.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C4fVgNdG.js";import"./index-B1nmLjVU.js";import"./Select-C88ZnGPe.js";import"./BUIRoutingProvider-Br-iQzf_.js";import"./useFocusRing-DHTQT_lC.js";import"./Button-BGvlfnXd.js";import"./utils-CwhAgYFH.js";import"./Label-DQRKBs9u.js";import"./Hidden-DBz78_xE.js";import"./useLabel-BqXJUdIq.js";import"./useLabels-Cfrddupv.js";import"./number-pMJydGgE.js";import"./I18nProvider-BWEEs8VU.js";import"./useButton-CWlVdGLP.js";import"./usePress-BBc3t8hk.js";import"./textSelection-BFKOQOEH.js";import"./getMetaValue-DQETedN7.js";import"./useHover-BwVq8lt0.js";import"./FieldError-DL_kDnPL.js";import"./Text-BwMA6h-D.js";import"./Form-D-cmgni0.js";import"./useFormValidation-DYfGZ5Hl.js";import"./ListBox-DQ-jeWuP.js";import"./useCollection-9mRLMTIV.js";import"./keyboard-C1BU-mJQ.js";import"./FocusScope-CheC5fUy.js";import"./useEvent-CsLuvQke.js";import"./useControlledState-BBNR5rbN.js";import"./useLoadMoreSentinel-gwFkhROW.js";import"./Autocomplete-BZ8YDJ7_.js";import"./useLocalizedStringFormatter-_mO6LhbJ.js";import"./SelectionIndicator-BjrFLQ2m.js";import"./useListState-BlvQ7DnP.js";import"./Dialog-C2sEpcT_.js";import"./Heading-FIU2EEPa.js";import"./useOverlayTriggerState-Ck3aLq9p.js";import"./VisuallyHidden-DYnnSaaL.js";import"./animation-CUxQyO9K.js";import"./useField-C1HA1GEO.js";import"./useFormReset-CGHYUZyq.js";import"./Input-DUNVeClm.js";import"./SearchField-BeqgXNBB.js";import"./useTextField-DFNj753b.js";import"./useFilter-D9qFlObz.js";import"./useCollectionAdapter-BskBYHQ0.js";import"./Avatar-DDnB_C6N.js";import"./Skeleton-CKsNkLmL.js";import"./FieldLabel-D7x2y3aD.js";import"./FieldError-wj2CKSs8.js";import"./Popover-DO1EHdYm.js";import"./Text-cxciQkna.js";import"./ButtonIcon-05b3-25k.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
