import{T as P}from"./TablePagination-MTF0tAFP.js";import"./iframe-C1Du46eF.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DOq-huoO.js";import"./index-C0MspUWn.js";import"./Select-Dgw2cXmr.js";import"./Button-kKzp0Xb2.js";import"./utils-hkspyz06.js";import"./Label-CPEk2ZbI.js";import"./Hidden-BsQwcHXl.js";import"./useFocusRing-C0uj4VUP.js";import"./openLink-CByF1g0c.js";import"./useLabel-C8HhkV7I.js";import"./useLabels-CQnXJWhI.js";import"./number-DRYzdm3i.js";import"./I18nProvider-B27jmHNy.js";import"./useButton-DUAO8AkZ.js";import"./usePress-CiBw4CLk.js";import"./textSelection-DIl4JRXM.js";import"./useHover-CFEPcSqQ.js";import"./FieldError-CW_JKSLC.js";import"./Text-DDKqJmZc.js";import"./useFormValidation-BhsMD-cv.js";import"./ListBox-CWZ1YyXv.js";import"./useCollection-CeYnkAnH.js";import"./keyboard-CFktmufy.js";import"./FocusScope-CrWLtl4c.js";import"./useEvent-B0PtjqRu.js";import"./useControlledState-BHe0N0Aq.js";import"./getItemCount-CqKXvEF9.js";import"./Autocomplete-BjwsbRnL.js";import"./useLocalizedStringFormatter-CpQkqVsH.js";import"./useListState-CzlqaNAY.js";import"./Dialog-CzTKiC-y.js";import"./Heading-Ca3If9fa.js";import"./useOverlayTriggerState-MXUE1IGe.js";import"./VisuallyHidden-Cg3DRSEG.js";import"./animation-Cp8UTTIv.js";import"./useField-CN5nphuL.js";import"./useFormReset-D4W7gYuW.js";import"./Input-BWPK4-A8.js";import"./SearchField-BPDn4Goy.js";import"./useTextField-6Mu4PHW9.js";import"./useFilter-BXRhrNJJ.js";import"./useCollectionAdapter-D7AenGWX.js";import"./Avatar-CXUJTOCk.js";import"./Skeleton-CpRL6WIe.js";import"./FieldLabel-DRtV_aZV.js";import"./FieldError-DnT8g_gb.js";import"./Popover-BDecb4J0.js";import"./Text-BU3kVSsj.js";import"./ButtonIcon-CDLdhfta.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
