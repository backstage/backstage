import{T as P}from"./TablePagination-CCO6SPhY.js";import"./iframe-SQ-DrL5X.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BvCpdf-D.js";import"./index-CmVRNaDw.js";import"./Select-DirceWfY.js";import"./Button-ChyeSkQq.js";import"./utils-DS6PrpIl.js";import"./Label-CZqZr_x1.js";import"./Hidden-ZDc1mtAl.js";import"./useFocusRing-BjVI5GO7.js";import"./openLink-DWLtw0ci.js";import"./useLabel-w96aGTJB.js";import"./useLabels-X84YCiAH.js";import"./number-CcK3WKXn.js";import"./I18nProvider-z6RUFbQd.js";import"./useButton-BSkNsead.js";import"./usePress-DMyM15Qa.js";import"./textSelection-B-fLBI4W.js";import"./useHover-DHCGAdFi.js";import"./FieldError-Dy6WAbxG.js";import"./Text-BW-I_WTv.js";import"./useFormValidation-BDrZPX9Z.js";import"./ListBox-CpUeOb2P.js";import"./useCollection-YrQYX9l4.js";import"./keyboard-xERIyYjI.js";import"./FocusScope-D5AOa8UF.js";import"./useEvent-Cl1lm5-9.js";import"./useControlledState-BLu3Mzk7.js";import"./getItemCount-jCJO8FnC.js";import"./Autocomplete-DIjTkbA4.js";import"./useLocalizedStringFormatter-CHao35Rz.js";import"./useListState-C4gaL_Hh.js";import"./Dialog-C_hxccYm.js";import"./Heading-D0gwOF84.js";import"./useOverlayTriggerState-DEML2GX7.js";import"./VisuallyHidden-CueUzKiJ.js";import"./animation-CoeCW5HE.js";import"./useField-DiPkCaUr.js";import"./useFormReset-CCiws3BY.js";import"./Input-ByFHAFjD.js";import"./SearchField-Dy2eL_Nb.js";import"./useTextField-ScBV4IXz.js";import"./useFilter-BmxzhHXe.js";import"./useCollectionAdapter-BIrcLn5B.js";import"./Avatar-CCrEbkp7.js";import"./Skeleton-lPdlp7Pt.js";import"./FieldLabel-D2Zv4J0k.js";import"./FieldError--heBlvbI.js";import"./Popover-DGCNNE-g.js";import"./Text-AZjGv-Pn.js";import"./ButtonIcon-DSZd6VxV.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
