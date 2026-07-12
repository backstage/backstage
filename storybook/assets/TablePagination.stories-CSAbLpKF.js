import{T as P}from"./TablePagination-BwAXU4Bg.js";import"./iframe-CO97OZwt.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BjR_AUMv.js";import"./index-B3bIYSdF.js";import"./Select-hZ772CN6.js";import"./Button-iLMA8lft.js";import"./utils-2TV2V9Pm.js";import"./Label-k8w2r2dv.js";import"./Hidden-BxbxCXE4.js";import"./useFocusRing-DpTaIKKT.js";import"./openLink-DjHgJdx-.js";import"./useLabel-Bfjkj2_o.js";import"./useLabels-DeJJCjaB.js";import"./number-CjvqZMqN.js";import"./I18nProvider-D_UQ682O.js";import"./useButton-CXBhsRKD.js";import"./usePress-fdXfQbXd.js";import"./textSelection-d1OV0NFv.js";import"./useHover-DfkDjIau.js";import"./FieldError-CskjcK-s.js";import"./Text-CUpMtLsq.js";import"./useFormValidation-qxu3lVOI.js";import"./ListBox-D_ItXpox.js";import"./useCollection-CEmDEXQB.js";import"./keyboard-BickwFmq.js";import"./FocusScope-D-WCKiLu.js";import"./useEvent-20WkBKcw.js";import"./useControlledState-BEju7Fey.js";import"./getItemCount-bOoscO0L.js";import"./Autocomplete-CrnLxG4M.js";import"./useLocalizedStringFormatter-g2jqPPVg.js";import"./useListState-5cme9xYE.js";import"./Dialog-BS9Kha0D.js";import"./Heading-ZVC2xVlm.js";import"./useOverlayTriggerState-NEjJCFrQ.js";import"./VisuallyHidden-BMX6CTzb.js";import"./animation-ChIICKgy.js";import"./useField-Ajy5nl1g.js";import"./useFormReset-Dt1KXmT7.js";import"./Input-CpR11oJO.js";import"./SearchField-BkcNXse-.js";import"./useTextField-Q1vUUksR.js";import"./useFilter-B8cQfcZU.js";import"./useCollectionAdapter-808SJjhy.js";import"./Avatar-C0j-7bCC.js";import"./Skeleton-D1uHqmbO.js";import"./FieldLabel-IyRy5iXb.js";import"./FieldError-BW3PYLeL.js";import"./Popover-CiMz3qcA.js";import"./Text-CFTB_dmB.js";import"./ButtonIcon-CwIjbb2m.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
