import{T as P}from"./TablePagination-OWyKxNWr.js";import"./iframe-NUkawwzR.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Dr07-kua.js";import"./index-ZCQkfQFP.js";import"./Select-Dsv1hug7.js";import"./Button-CJp4hemi.js";import"./utils-uzdfuIw1.js";import"./Label-CtWn_4Sh.js";import"./Hidden-Bd1CbclD.js";import"./useFocusRing-DRFr-2Cy.js";import"./openLink-DneRJetG.js";import"./useLabel-Cvlyn-hw.js";import"./useLabels-DJ5agKFT.js";import"./number-DLVdbGSj.js";import"./I18nProvider-CqeGaTnN.js";import"./useButton-XKjpTY_V.js";import"./usePress-qMWH2nhk.js";import"./textSelection-BbKxZHU7.js";import"./useHover-Cr1OjqYT.js";import"./FieldError-C13gsDR2.js";import"./Text-BSvRbAi-.js";import"./useFormValidation-K7MK4t4L.js";import"./ListBox-CgrQ7JzQ.js";import"./useCollection-BFZ8Mva3.js";import"./keyboard-DqU_Guq5.js";import"./FocusScope-D5wPs4XX.js";import"./useEvent-DC4HEiiy.js";import"./useControlledState-BIbEMjh-.js";import"./getItemCount-DyUYfSGm.js";import"./Autocomplete-D9312KrT.js";import"./useLocalizedStringFormatter-D5KRTDrf.js";import"./useListState-XpTuyFaL.js";import"./Dialog-DWI7O1n5.js";import"./Heading-1hqC57xx.js";import"./useOverlayTriggerState-YiJso-k_.js";import"./VisuallyHidden-Dxs1JZ9R.js";import"./animation-DhnO4M0k.js";import"./useField-B3g5yX1O.js";import"./useFormReset-B12SLtR-.js";import"./Input-B0ZBMtvO.js";import"./SearchField-DJW0E395.js";import"./useTextField-DGqGeHGi.js";import"./useFilter-c2wXEFcC.js";import"./useCollectionAdapter-BaM8iK9X.js";import"./Avatar-Dk9Eyyf_.js";import"./Skeleton-BCXvALv5.js";import"./FieldLabel-DfnxIYBh.js";import"./FieldError-DiQaHyEj.js";import"./Popover-DA71V3Sc.js";import"./Text-yJf-YvvS.js";import"./ButtonIcon-MBag5ReQ.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
