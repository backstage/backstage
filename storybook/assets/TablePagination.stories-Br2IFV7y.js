import{T as P}from"./TablePagination--m-AOWBo.js";import"./iframe-D9zyyCLm.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DW2A_FKT.js";import"./index-BJpHCwC2.js";import"./Select-Y5OCbBt1.js";import"./Button-eiFaSVQp.js";import"./utils-BhB9Kn0J.js";import"./Label-8xCw--Gh.js";import"./Hidden-BEbPYnKb.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./useLabel-CNCvRjXr.js";import"./useLabels-Cf60hIuc.js";import"./number-oRZks6E2.js";import"./I18nProvider-CFA5Nn83.js";import"./useButton-Br280P7j.js";import"./usePress-DakPojsx.js";import"./textSelection-B_folLqx.js";import"./getMetaValue-DvVIc-fc.js";import"./useHover-CXer1LBh.js";import"./FieldError-PBAfGMRH.js";import"./Text-DyJll7O5.js";import"./Form-BKc8ubiD.js";import"./useFormValidation-DU6bMNno.js";import"./ListBox-CLfyKQ5P.js";import"./useCollection-B26EPvJy.js";import"./keyboard-DCFt_Vdh.js";import"./FocusScope-lLzncA3g.js";import"./useEvent-CgIHwaqr.js";import"./useControlledState-CNVQPQl6.js";import"./useLoadMoreSentinel-CSmiezNk.js";import"./Autocomplete-y5aAoPrH.js";import"./useLocalizedStringFormatter-Cws02Rph.js";import"./SelectionIndicator-DYFHwb90.js";import"./useListState-DNv1jxCo.js";import"./Dialog-B4rjAWyQ.js";import"./Heading-B3QLbIIh.js";import"./useOverlayTriggerState-BkEw8wth.js";import"./VisuallyHidden-k2mNg0ke.js";import"./animation-Dc2F1pm8.js";import"./useField-BFVTHaKM.js";import"./useFormReset-fb_8OtZl.js";import"./Input-HAwV3UgY.js";import"./SearchField-BIwjR7hY.js";import"./useTextField-CnV1bkF2.js";import"./useFilter-HAVuwduG.js";import"./useCollectionAdapter-D_OEcD2f.js";import"./Avatar-DVnze6nl.js";import"./Skeleton-CK2nVPhU.js";import"./FieldLabel-Bco1t6YF.js";import"./FieldError-CW07svXX.js";import"./Popover-K4MaOPOU.js";import"./Text-CgjLIcL_.js";import"./ButtonIcon-D9JFIQSe.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
