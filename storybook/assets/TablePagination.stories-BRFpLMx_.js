import{T as P}from"./TablePagination-CYZIVmvF.js";import"./iframe-CxlUpTpq.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Dh3jViZn.js";import"./index-m_RVXM54.js";import"./Select-CGVWl9t0.js";import"./Button-Dk1TuodQ.js";import"./utils-BiH69BEF.js";import"./Label-Ci2BW9le.js";import"./Hidden-f_G1o6Y7.js";import"./useFocusRing-DKBxNAkp.js";import"./openLink-DT4-HiOA.js";import"./useLabel-DDDO_Y6W.js";import"./useLabels-ZAvHqBgR.js";import"./number-wfr-a2dw.js";import"./I18nProvider-g-YIgX08.js";import"./useButton-DqI1YsZH.js";import"./usePress-BAaUvFTM.js";import"./textSelection-B_r4mkkT.js";import"./useHover-DMFi8o2f.js";import"./FieldError-CbBZt737.js";import"./Text-BTU8fM3z.js";import"./useFormValidation-CsOIPDNg.js";import"./ListBox-DPwHHXW0.js";import"./useCollection-Bo0XBD87.js";import"./keyboard-Cx6bvV3F.js";import"./FocusScope-YrQuOEYJ.js";import"./useEvent-Duv0WJvN.js";import"./useControlledState-CxsccuSa.js";import"./getItemCount-7dUMKGgw.js";import"./Autocomplete-DKAPF810.js";import"./useLocalizedStringFormatter-CusjQb-x.js";import"./useListState-6GcH4O3w.js";import"./Dialog-CLzWZ8kX.js";import"./Heading-DuCmUnSY.js";import"./useOverlayTriggerState-G8ih59XW.js";import"./VisuallyHidden-CgJk2kmU.js";import"./animation-D6w75ks6.js";import"./useField-Bu9yMuoU.js";import"./useFormReset-BXjwexTG.js";import"./Input-cUEZAZ1h.js";import"./SearchField-C1i_rKX7.js";import"./useTextField-BOI3orl0.js";import"./useFilter-NlzrNSaD.js";import"./useCollectionAdapter-DjbW8h9-.js";import"./Avatar-DsgDLLgM.js";import"./Skeleton-zj_Qr4R5.js";import"./FieldLabel-DnzjbgeC.js";import"./FieldError-BqeaqOrJ.js";import"./Popover-CyvKOCb_.js";import"./Text-BnjPxtF1.js";import"./ButtonIcon-BJxB3R9Y.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
