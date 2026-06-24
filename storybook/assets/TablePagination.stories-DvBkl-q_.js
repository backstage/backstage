import{T as P}from"./TablePagination-DUuLSj_6.js";import"./iframe-DhttR-Z-.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BfSKs3Th.js";import"./index-51pH9e5U.js";import"./Select-C4s4Sb48.js";import"./Button-DgJKv_H5.js";import"./utils-LkJ3JQqS.js";import"./Label-uZej1Dod.js";import"./Hidden-BK8KEPOj.js";import"./useFocusRing-BMND1Xfk.js";import"./openLink-DDEWcvNy.js";import"./useLabel-DSVSe0FP.js";import"./useLabels-DbXANuou.js";import"./number-YKfsi7Zw.js";import"./I18nProvider-DS1fhYi3.js";import"./useButton-8cfX40X5.js";import"./usePress-D7UEUwIV.js";import"./textSelection-Gj6MkmHl.js";import"./useHover-DWM3_5-p.js";import"./FieldError-DMbGr69Y.js";import"./Text-OfXWTW-q.js";import"./useFormValidation-CWHGY4c7.js";import"./ListBox-BBpHvFIQ.js";import"./useCollection-CmQEMhBS.js";import"./keyboard-BZWrF7pG.js";import"./FocusScope-B4sVtO-l.js";import"./useEvent-BqGsjR8x.js";import"./useControlledState-CmzpYLdm.js";import"./getItemCount-WPYudUmT.js";import"./Autocomplete-du-Wb1TU.js";import"./useLocalizedStringFormatter-DPzPf3bZ.js";import"./useListState-DT_uuQg6.js";import"./Dialog-B4ix50AT.js";import"./Heading-CSGOVgUl.js";import"./useOverlayTriggerState-Cb5yY_lY.js";import"./VisuallyHidden-B4DWlS1H.js";import"./animation-BK6cA2RP.js";import"./useField-CV1e6J1X.js";import"./useFormReset-Buno64eF.js";import"./Input-BXU-L0c3.js";import"./SearchField-CLX91gFA.js";import"./useTextField-D-rC3zog.js";import"./useFilter-DipkhEIn.js";import"./useCollectionAdapter-D8otSXc1.js";import"./Avatar-CORnhkEq.js";import"./Skeleton-B3nGTZk7.js";import"./FieldLabel-B1ltaPtV.js";import"./FieldError-Dl6Hm0lH.js";import"./Popover-jsgv1o2Z.js";import"./Text-XAqvAdRp.js";import"./ButtonIcon-DwbYCR6I.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
