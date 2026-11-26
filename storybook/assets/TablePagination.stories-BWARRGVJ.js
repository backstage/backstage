import{T as P}from"./TablePagination-Ce_lQOPA.js";import"./iframe-bb_jNxxL.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CTDjzFB8.js";import"./index-gvfFGbLs.js";import"./Select-DMi6FLOk.js";import"./BUIRoutingProvider-DqHM2OTt.js";import"./useFocusRing-DDqjVrJn.js";import"./Button-B0WaVeZf.js";import"./utils-Cyge8L4m.js";import"./Label-C64Zc2HQ.js";import"./Hidden-7ff-isZb.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./number-DwC5Q0g4.js";import"./I18nProvider-B9G7Dj3y.js";import"./useButton-Dgm20RBw.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./getMetaValue-BAPq9Qsv.js";import"./useHover-dfqWQZHs.js";import"./FieldError-CzTxz--v.js";import"./Text-BtpIt2qG.js";import"./Form-C58QXp5W.js";import"./useFormValidation-CWqstwdw.js";import"./ListBox-16vWbqAu.js";import"./useCollection-DV0iE3Tb.js";import"./keyboard-CTRGf6zG.js";import"./FocusScope-H3a-3FIW.js";import"./useEvent-CLir4Cc2.js";import"./useControlledState-B45Nf08u.js";import"./useLoadMoreSentinel-C2DRsS6z.js";import"./Autocomplete-DbeBzPgx.js";import"./useLocalizedStringFormatter-Db8iDqbo.js";import"./SelectionIndicator-BvbLcwFj.js";import"./useListState-DG0_AzeR.js";import"./Dialog-CshjZfCk.js";import"./Heading-DqjAjdHh.js";import"./useOverlayTriggerState-Cwdw0na1.js";import"./VisuallyHidden-V0bjBViI.js";import"./animation-BLiFJPlN.js";import"./useField-BGbko4b6.js";import"./useFormReset-Dv4_zW6V.js";import"./Input-Dr54Is2P.js";import"./SearchField-C4sv5qiQ.js";import"./useTextField-CI0DqPWz.js";import"./useFilter-BEmfJ5SZ.js";import"./useCollectionAdapter-BWqxT6M2.js";import"./Avatar-DAM8KZz5.js";import"./Skeleton-BQfjs2Zp.js";import"./FieldLabel-DUh1p05c.js";import"./FieldError-8hzroWbP.js";import"./Popover-CPw8do0q.js";import"./Text-BseoxH0X.js";import"./ButtonIcon-D9OaYA-z.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
