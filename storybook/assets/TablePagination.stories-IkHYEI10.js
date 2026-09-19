import{T as P}from"./TablePagination-CGqHGeho.js";import"./iframe-DIcQvc_4.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CQfKhSp8.js";import"./index-DeTGLoK4.js";import"./Select-DvtwBkgq.js";import"./Button-C4PGOc91.js";import"./utils-JYodRznf.js";import"./Label-CLke59gh.js";import"./Hidden-BBwtWmDi.js";import"./useFocusRing-C4tfuByP.js";import"./openLink-BR6QeS5d.js";import"./useLabel-BYY4_2g1.js";import"./useLabels-ITbgZNHU.js";import"./number-D2azkskk.js";import"./I18nProvider-BUw0KQ7A.js";import"./useButton-QYfWJvVm.js";import"./usePress-BIUzH6ox.js";import"./textSelection-DrSKaTGN.js";import"./useHover-CrozpiDB.js";import"./FieldError-BmDNj2fS.js";import"./Text-CiWDOLRD.js";import"./useFormValidation-DdNhI11s.js";import"./ListBox-BlWbtl4n.js";import"./useCollection-CyoSzQaI.js";import"./keyboard-taUe_H6E.js";import"./FocusScope-CEEamkqC.js";import"./useEvent-DE6s5RBO.js";import"./useControlledState-CaCljqv7.js";import"./getItemCount-DD4SHQDj.js";import"./Autocomplete-4JeE3WOL.js";import"./useLocalizedStringFormatter-CpwYaMVi.js";import"./useListState-GRJskBCg.js";import"./Dialog-BoJzSVC3.js";import"./Heading-DzNAi1Am.js";import"./useOverlayTriggerState-ovQ1kmtR.js";import"./VisuallyHidden-W2sx5irF.js";import"./animation-B_Bf72uX.js";import"./useField-BhZZQjtf.js";import"./useFormReset-ZBhvFFWB.js";import"./Input-DPAuMq7N.js";import"./SearchField-CDlUIPhF.js";import"./useTextField-Dx3e69-L.js";import"./useFilter-CBueS5oQ.js";import"./useCollectionAdapter-YueaZV58.js";import"./Avatar-GO4quA2s.js";import"./Skeleton-pRNoAaKn.js";import"./FieldLabel-VMPUoJKD.js";import"./FieldError-CE8xhb3F.js";import"./Popover-D0DBcZrz.js";import"./Text-ybBQtNv8.js";import"./ButtonIcon-BVlPIGD0.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
