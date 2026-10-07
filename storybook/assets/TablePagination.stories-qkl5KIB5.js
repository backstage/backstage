import{T as P}from"./TablePagination-CGcPDgfQ.js";import"./iframe-piw0-GWS.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-IkhajRyJ.js";import"./index-Co7WXYIc.js";import"./Select-BukPr23n.js";import"./Button-Cm250GNY.js";import"./utils-wuzg6Gut.js";import"./Label-BZuUhWGV.js";import"./Hidden-ChjLH5Dh.js";import"./useFocusRing-BpapEP6W.js";import"./openLink-BiQlZAwx.js";import"./useLabel-ETY-Wxlf.js";import"./useLabels-BulSWJbq.js";import"./number-gEdanb4Y.js";import"./I18nProvider-DMoCT0pg.js";import"./useButton-Cruw1eRB.js";import"./usePress-Bwx27jrs.js";import"./textSelection-eCd97__a.js";import"./useHover-CBlM-Gvk.js";import"./FieldError-C00vbv1H.js";import"./Text-Dj98mrrm.js";import"./useFormValidation-CqX-gdFR.js";import"./ListBox-Cz2k-tzy.js";import"./useCollection-ClPqs5Wg.js";import"./keyboard-CxUCvJz3.js";import"./FocusScope-DEgH-NEq.js";import"./useEvent-BcEtlgIb.js";import"./useControlledState-WBvh0vQ5.js";import"./getItemCount-B2mBp9xv.js";import"./Autocomplete-Ci1mTh4c.js";import"./useLocalizedStringFormatter-BNjNGOHG.js";import"./useListState-CjmLZ2hO.js";import"./Dialog-xhnks7ef.js";import"./Heading-DKJAsgjc.js";import"./useOverlayTriggerState-CkdldBFn.js";import"./VisuallyHidden-Ym6V1FKZ.js";import"./animation-BJ7i84cK.js";import"./useField-BmyRXti8.js";import"./useFormReset-ByZK7tlo.js";import"./Input-DV5mrE8x.js";import"./SearchField-BrJjx7s0.js";import"./useTextField-B4zMgAH5.js";import"./useFilter-Blvverws.js";import"./useCollectionAdapter-CfBIE-4-.js";import"./Avatar-B4D1FHoW.js";import"./Skeleton-xRn948sa.js";import"./FieldLabel-BAVB1tiW.js";import"./FieldError-7iFx9auU.js";import"./Popover-DWbPFxpz.js";import"./Text-BtczWjb8.js";import"./ButtonIcon-BIt07zdx.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
