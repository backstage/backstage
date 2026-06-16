import{T as P}from"./TablePagination-BUtTMpvA.js";import"./iframe-Dv_LOz74.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-D8wsRhUy.js";import"./index-D7_0ED1P.js";import"./Select-zNkXRHK-.js";import"./Button-CzjW6nK8.js";import"./utils-CjhwUgks.js";import"./Label-C9AKJy0p.js";import"./Hidden-DEjifGz4.js";import"./useFocusRing-CCaIs5i6.js";import"./openLink-CPEyVxLu.js";import"./useLabel-quKVFZ4h.js";import"./useLabels-DeGtPF3O.js";import"./number-DcdAJwkG.js";import"./I18nProvider-D_j_7FFZ.js";import"./useButton-BOWiNUyp.js";import"./usePress-CZZ04Swj.js";import"./textSelection-LNwAMZgu.js";import"./useHover-DQFpSDLs.js";import"./FieldError-B3xmL9zJ.js";import"./Text-COdlm33f.js";import"./useFormValidation-CDwxaZF-.js";import"./ListBox-D2GDv8e9.js";import"./useCollection-DPVu96vk.js";import"./keyboard-CTWwmG_b.js";import"./FocusScope-fsz2TYUP.js";import"./useEvent-DM9ivS_a.js";import"./useControlledState-Bgmi2uXG.js";import"./getItemCount-Dk4QTH-a.js";import"./Autocomplete-B9zp45Lj.js";import"./useLocalizedStringFormatter-C9jxhAjU.js";import"./useListState-CZ3oZULj.js";import"./Dialog-CSsPj7-g.js";import"./Heading-BbSdya8h.js";import"./useOverlayTriggerState-Fiozm-_i.js";import"./VisuallyHidden-BPDNWWpa.js";import"./animation-CtmxAvKr.js";import"./useField-5isTmZBK.js";import"./useFormReset-BRPqBP2J.js";import"./Input-PEFc4oFr.js";import"./SearchField-CGOe6D6C.js";import"./useTextField-CWhFKII_.js";import"./useFilter-FySoUhC1.js";import"./useCollectionAdapter-ESo_ovJ7.js";import"./Avatar-Dyumd67B.js";import"./Skeleton-dUzRIgQV.js";import"./FieldLabel-CHThtwDn.js";import"./FieldError-zRgA20wC.js";import"./Popover-BceUP22B.js";import"./Text-BAFL7TR1.js";import"./ButtonIcon-Bavqw6xA.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
