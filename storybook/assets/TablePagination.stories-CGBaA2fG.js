import{T as P}from"./TablePagination-TGzT2M7T.js";import"./iframe-C8V0qqb2.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Bmpa_pzq.js";import"./index-X2scoYBO.js";import"./Select-Dc3vRhl5.js";import"./BUIRoutingProvider-BxHvEIyM.js";import"./useFocusRing-A5enshti.js";import"./Button-BEmepp9I.js";import"./utils-D2G7Gr3-.js";import"./Label-lDwdRkmF.js";import"./Hidden-DiQ-sckr.js";import"./useLabel-Du92kFjZ.js";import"./useLabels-D_iZwDzY.js";import"./number-BQr42Lr5.js";import"./I18nProvider-Cjl-_wzY.js";import"./useButton-dvUW2Qss.js";import"./usePress-DxDbMcWz.js";import"./textSelection-DSE97Rz3.js";import"./getMetaValue-Cs0hmg7u.js";import"./useHover-BM2aAfmJ.js";import"./FieldError-B6JD0CK_.js";import"./Text-C3Fp9zoI.js";import"./Form-ro32D7sS.js";import"./useFormValidation-DCkaOoFr.js";import"./ListBox-Ci7SfdT3.js";import"./useCollection-BWA8DlX5.js";import"./keyboard-C8VvzxKH.js";import"./FocusScope-QAIUBJGW.js";import"./useEvent-8_12ARkl.js";import"./useControlledState-CSkhWUnX.js";import"./useLoadMoreSentinel-D-NY2IrU.js";import"./Autocomplete-F_-RRsBG.js";import"./useLocalizedStringFormatter-BSUQ5ifA.js";import"./SelectionIndicator-BqCnbUA9.js";import"./useListState-NmGMDQQG.js";import"./Dialog-R49q_bbw.js";import"./Heading-Cq8dttCG.js";import"./useOverlayTriggerState-BJpvAEhl.js";import"./VisuallyHidden-CoLsK902.js";import"./animation-CQDNL3hS.js";import"./useField-CnWanIwr.js";import"./useFormReset-BkDzJlqC.js";import"./Input-C6rRPFvc.js";import"./SearchField-rGiMC4mQ.js";import"./useTextField-DZRsoRku.js";import"./useFilter-CFwrG83c.js";import"./useCollectionAdapter-CTbGM5nP.js";import"./Avatar-B9FXqcIn.js";import"./Skeleton-B0L6SHY5.js";import"./FieldLabel-CJjIrQrv.js";import"./FieldError-Bv3u66G_.js";import"./Popover-BUvm-DpH.js";import"./Text-DCzxn_GK.js";import"./ButtonIcon-BcbsxwMp.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
