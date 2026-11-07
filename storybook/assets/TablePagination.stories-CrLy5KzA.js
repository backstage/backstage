import{T as P}from"./TablePagination-Qd8ndHgj.js";import"./iframe-DxHtOo4h.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-D6AnwJdq.js";import"./index-DmHLeUzN.js";import"./Select-Cq76z9Jn.js";import"./Button-CI1wjYfp.js";import"./utils-CAdw532L.js";import"./Label-JZuHlYG-.js";import"./Hidden-C-73n3sF.js";import"./useFocusRing-DGlhroDz.js";import"./openLink-DpClGL1h.js";import"./useLabel-D3L5WW2z.js";import"./useLabels-DjvWLG0Y.js";import"./number-CI02LZgf.js";import"./I18nProvider-CE0E7M0k.js";import"./useButton-DqQwDYXZ.js";import"./usePress-Du1TfnjE.js";import"./textSelection-BtPkczBw.js";import"./getMetaValue-Its-2R3E.js";import"./useHover-CHigp1TN.js";import"./FieldError-BJ_bTBup.js";import"./Text-um_55q4T.js";import"./Form-DU0UIvGK.js";import"./useFormValidation-DZL7-bkS.js";import"./ListBox-D1dnPtKz.js";import"./useCollection-awxMT8m7.js";import"./keyboard-CuZJZT3E.js";import"./FocusScope-r31b8uNz.js";import"./useEvent-DtIMMGwF.js";import"./useControlledState-BOC0pUVV.js";import"./useLoadMoreSentinel-CQ1OEE4r.js";import"./Autocomplete-Blt4da4X.js";import"./useLocalizedStringFormatter-DmTXBO-j.js";import"./SelectionIndicator-cIpGtlp8.js";import"./useListState-DSnQWJm8.js";import"./Dialog-CiqaPTDN.js";import"./Heading-BuGaXw8R.js";import"./useOverlayTriggerState-DW7Yz7pQ.js";import"./VisuallyHidden-DeN7y8kn.js";import"./animation-BiNajT-w.js";import"./useField-uTiKHKmu.js";import"./useFormReset-DnnjnzwE.js";import"./Input-DCzt78cV.js";import"./SearchField-CBYEWe3s.js";import"./useTextField-CaKqjYbL.js";import"./useFilter-hzwVE0Ie.js";import"./useCollectionAdapter-D3tUYMqc.js";import"./Avatar-DHLJZzwu.js";import"./Skeleton-DbFZSBMq.js";import"./FieldLabel-PoMkJI-d.js";import"./FieldError-DdcUKVe7.js";import"./Popover-Bpv0Ahnr.js";import"./Text-DFAGoz8c.js";import"./ButtonIcon-BqQ6_ttV.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
