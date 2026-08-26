import{T as P}from"./TablePagination-9hrF-hwn.js";import"./iframe-Zd-YI-2K.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CSGev21E.js";import"./index-CirsuCpW.js";import"./Select-D6J4yYEB.js";import"./Button-BPK5A0ph.js";import"./utils-B9HGNt0C.js";import"./Label-YhzAN0Eo.js";import"./Hidden-5-RKz3aG.js";import"./useFocusRing-B2ToGNzb.js";import"./openLink-Bn8ArFiV.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./number-DiAqIE8i.js";import"./I18nProvider-BhAOc9Ga.js";import"./useButton-BzU-QnhQ.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./useHover-BUmLyoKK.js";import"./FieldError-5PqzcpId.js";import"./Text-BJ1H8aMC.js";import"./useFormValidation-DCAqIXhc.js";import"./ListBox-CwRQCJrJ.js";import"./useCollection-56kX9o5o.js";import"./keyboard-D9WPU0OD.js";import"./FocusScope-D-eoOKQj.js";import"./useEvent-Bvwyi-gT.js";import"./useControlledState-DInYdsj6.js";import"./getItemCount-DPCKm2BS.js";import"./Autocomplete-DTC98uk5.js";import"./useLocalizedStringFormatter-1rTSaIVc.js";import"./useListState-Ba_x5rtm.js";import"./Dialog-6paZnkzR.js";import"./Heading-BJB_7RPS.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./VisuallyHidden-Do0nVhed.js";import"./animation-BuTCjKPk.js";import"./useField-Cx2viaGD.js";import"./useFormReset-CiFp_S2j.js";import"./Input-DNefN7x7.js";import"./SearchField-DHbszZZe.js";import"./useTextField-BK-HcGoi.js";import"./useFilter-B360iIVa.js";import"./useCollectionAdapter-CkR5h81X.js";import"./Avatar-j5zsmd-v.js";import"./Skeleton-CpfVVKI5.js";import"./FieldLabel-BFHnaWne.js";import"./FieldError-DcteGN6b.js";import"./Popover-Ewo1ut50.js";import"./Text-CFiK0v-x.js";import"./ButtonIcon-8KnJDrRQ.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
