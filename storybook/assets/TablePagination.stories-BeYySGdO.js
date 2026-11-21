import{T as P}from"./TablePagination-9QUlSQwN.js";import"./iframe-81VbGqYS.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CnOD3daG.js";import"./index-CoR4Ep33.js";import"./Select-DZP52pdP.js";import"./BUIRoutingProvider-DmskIIHn.js";import"./useFocusRing-DYHYlv_4.js";import"./Button-C-RbpSFH.js";import"./utils-Bc3qSy6a.js";import"./Label-Dd3OarLH.js";import"./Hidden-Cb1mFWSL.js";import"./useLabel-DNA1h8U7.js";import"./useLabels-DvwPDbuz.js";import"./number-CXfm_f_X.js";import"./I18nProvider-DxzKOluv.js";import"./useButton-D4MYDvTL.js";import"./usePress-Ck2OcU07.js";import"./textSelection-Dc2ic2y7.js";import"./getMetaValue-CCa-nVAs.js";import"./useHover-BliW0Nnt.js";import"./FieldError-ptcf45Tc.js";import"./Text-Dwv53_8C.js";import"./Form-BW2R70vK.js";import"./useFormValidation-iCx97y-U.js";import"./ListBox-C20e-ujn.js";import"./useCollection-CQ5WrmA1.js";import"./keyboard-CCO2TRC1.js";import"./FocusScope-DDyHpiBa.js";import"./useEvent-BH0muyj4.js";import"./useControlledState-DitDneEU.js";import"./useLoadMoreSentinel-BHThIPjI.js";import"./Autocomplete-DwtsJgQQ.js";import"./useLocalizedStringFormatter-CCFWdnVn.js";import"./SelectionIndicator-BKJhibyF.js";import"./useListState-CNgw0_PC.js";import"./Dialog-YrzWagd5.js";import"./Heading-CoXsiMEk.js";import"./useOverlayTriggerState-CQqx4yUK.js";import"./VisuallyHidden-DRGpg-Tu.js";import"./animation-DeGzi18H.js";import"./useField-C1N2YRai.js";import"./useFormReset-BBjLEm68.js";import"./Input-D4Umh9QE.js";import"./SearchField-ESIovKsa.js";import"./useTextField-B6wfEo-c.js";import"./useFilter-B2Yw2vQL.js";import"./useCollectionAdapter-C_FFtqBX.js";import"./Avatar-BT6IQR_u.js";import"./Skeleton-Ckk1lHrw.js";import"./FieldLabel-Pdc5mp2G.js";import"./FieldError-CA1UYSqQ.js";import"./Popover-qQTluv15.js";import"./Text-YsoifKm_.js";import"./ButtonIcon-Dr7UhB0P.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
