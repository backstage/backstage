import{T as P}from"./TablePagination-Dr9rb5LW.js";import"./iframe-Di5Wv8w_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-VfTF6kKY.js";import"./index-C_LMY1zh.js";import"./Select-BL2_KBRE.js";import"./Button-CUbHo8av.js";import"./utils-B6tfyu-3.js";import"./Label-C3XyxUp7.js";import"./Hidden-CQX9C-br.js";import"./useFocusRing-BPuyfxah.js";import"./openLink-BAk59qtu.js";import"./useLabel-CGVvVLBl.js";import"./useLabels-B0juHqyU.js";import"./number-CGr55I-p.js";import"./I18nProvider-Dxi4hkuu.js";import"./useButton-BchjX23Y.js";import"./usePress-C2lMTGjY.js";import"./textSelection-D0hNc5Yy.js";import"./useHover-BfN1GoIh.js";import"./FieldError-Bjv2kxdK.js";import"./Text-B1IXOSEc.js";import"./useFormValidation-DlvzbiO5.js";import"./ListBox-hN0g2wiL.js";import"./useCollection-DqjpBTfn.js";import"./keyboard-NoPc3y_q.js";import"./FocusScope-B2HES5fa.js";import"./useEvent-CuOYtYB8.js";import"./useControlledState-BMloOWSe.js";import"./getItemCount-CBjAjuNY.js";import"./Autocomplete-BSnZkzEE.js";import"./useLocalizedStringFormatter-BlsbGP9l.js";import"./useListState-jz-je0jZ.js";import"./Dialog-DQiaRJTa.js";import"./Heading-DUbgD_Jd.js";import"./useOverlayTriggerState-BbiImD-e.js";import"./VisuallyHidden-DMNBewmj.js";import"./animation-DXfiyiY4.js";import"./useField-Ct6F0SgU.js";import"./useFormReset-CYxgn0S-.js";import"./Input-sOjH10cq.js";import"./SearchField-CuVOiLwK.js";import"./useTextField-D7txPfzv.js";import"./useFilter-Cqz1MX-e.js";import"./useCollectionAdapter-C381A0A5.js";import"./Avatar-DtBtuQkz.js";import"./Skeleton-r70mSXML.js";import"./FieldLabel-BwILdqEG.js";import"./FieldError-41BZcafy.js";import"./Popover-kPS7qz1E.js";import"./Text-Cq2wVIG2.js";import"./ButtonIcon-CeqKDHWs.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
