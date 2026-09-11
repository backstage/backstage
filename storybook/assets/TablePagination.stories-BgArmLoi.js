import{T as P}from"./TablePagination-Cp-VGJp9.js";import"./iframe-CZAQRplz.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DwsoHqPD.js";import"./index-D3WcWjUz.js";import"./Select-ByW2r_ko.js";import"./Button-ByHr54p0.js";import"./utils-BddjkJjV.js";import"./Label-Z5tvaBq7.js";import"./Hidden-nk8B1O_e.js";import"./useFocusRing-w6vd38rs.js";import"./openLink-CS4qCOfy.js";import"./useLabel-CveRpJyO.js";import"./useLabels-D2HB4ybw.js";import"./number-BaLbbo2Y.js";import"./I18nProvider-Dmp-YX3j.js";import"./useButton-CKjpqyyh.js";import"./usePress-QNMEwl8q.js";import"./textSelection-DmuaJtMt.js";import"./useHover-CrLHZKML.js";import"./FieldError-Dqt9OQB4.js";import"./Text-oz8KmHCB.js";import"./useFormValidation-C7BXlo68.js";import"./ListBox-BcYAFsVd.js";import"./useCollection-BTBd6Q10.js";import"./keyboard-31lURow8.js";import"./FocusScope-DxBZY3Gl.js";import"./useEvent-cTre3tI4.js";import"./useControlledState-Cx450bSi.js";import"./getItemCount-79iPCaxN.js";import"./Autocomplete-DrhcM_th.js";import"./useLocalizedStringFormatter-DCKaeSgE.js";import"./useListState-BIvwUSVs.js";import"./Dialog-B1Uzi68w.js";import"./Heading-ugg1DCO5.js";import"./useOverlayTriggerState-BMaBp8bg.js";import"./VisuallyHidden-Y5ImMuSV.js";import"./animation-5CSH7QQO.js";import"./useField-D2ei1an_.js";import"./useFormReset-L2mPc2fw.js";import"./Input-BGZ5ZOMc.js";import"./SearchField-BjcHwEhg.js";import"./useTextField-BQ0nsv3j.js";import"./useFilter-BlYk1YVC.js";import"./useCollectionAdapter-DmdWSDbA.js";import"./Avatar-CZHlqg96.js";import"./Skeleton-E_ecSCg6.js";import"./FieldLabel-DEK0lZDj.js";import"./FieldError-CgIP4zn5.js";import"./Popover-DZjKvSFL.js";import"./Text-DY2YjVjO.js";import"./ButtonIcon-wEBhiqto.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
