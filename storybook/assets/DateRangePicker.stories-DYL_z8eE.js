import{ax as R,f as y,j as e,r as v,p as I}from"./iframe-nLmXqEf7.js";import{$ as C,a as j,m as V,c as T,d as q,e as H,f as G,g as M,n as A,i as l,j as N,k as w,l as E}from"./DatePicker-g0ovomB0.js";import{$ as P}from"./Button-C296zZfo.js";import{c as U}from"./Input-BueuAVR-.js";import{H as Y,v as O,r as Z}from"./index-BcfFmlps.js";import{$ as J}from"./Heading-BuXrZ9Hf.js";import{F as K}from"./FieldLabel-Cwrz3oLT.js";import{F as Q}from"./FieldError-BGxAebJ0.js";import{P as X}from"./Popover-CinninWd.js";import{$ as ee}from"./useFormValidation-Coh1_1M8.js";import{$ as ae}from"./I18nProvider--lkhv8yr.js";import{B as re}from"./Button-10BUDNfS.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BHAGaPmB.js";import"./useObjectRef-BxjTy_io.js";import"./Text-D4GNDssI.js";import"./useFocusRing-CRF3QW5j.js";import"./openLink-52acbO8n.js";import"./useLocalizedStringFormatter-CdDwfP8u.js";import"./useLabels-Bv7MIFK3.js";import"./useUpdateEffect-DBBz6vMQ.js";import"./getItemCount-Dwowez1m.js";import"./useCollection-D-2zPf8m.js";import"./Hidden-Droxpmwn.js";import"./keyboard-Dzy1pKfB.js";import"./FocusScope-De3cvvw0.js";import"./useEvent-C9J8YBp8.js";import"./usePress-BTMgok7y.js";import"./textSelection-C5-Yq1FE.js";import"./useControlledState-I4v4Pk17.js";import"./useHover-DzrNdeA5.js";import"./VisuallyHidden-D6zotimm.js";import"./useField-Daqylzv8.js";import"./useLabel-BbXuH4g9.js";import"./useFormReset-Bmvk1LvB.js";import"./useFilter-Iscc1qHc.js";import"./number-Dv4JZ_AA.js";import"./Dialog-DCU4zn0B.js";import"./useOverlayTriggerState-WIWunhdp.js";import"./Autocomplete-2mvVyjFP.js";import"./animation-CIIPdLix.js";import"./FieldError-JUfGZ6Pi.js";import"./Label-DiUjif3Y.js";import"./useButton-D7NyzVB-.js";import"./definition-BgPB0HuP.js";const h={"bui-DateRangePicker":"_bui-DateRangePicker_18o3i_24","bui-DateRangePickerGroup":"_bui-DateRangePickerGroup_18o3i_36","bui-DateRangePickerButton":"_bui-DateRangePickerButton_18o3i_87","bui-DateRangePickerDateFields":"_bui-DateRangePickerDateFields_18o3i_98","bui-DateRangePickerDateInput":"_bui-DateRangePickerDateInput_18o3i_112","bui-DateRangePickerSegment":"_bui-DateRangePickerSegment_18o3i_132","bui-DateRangePickerSeparator":"_bui-DateRangePickerSeparator_18o3i_172","bui-DateRangePickerCalendar":"_bui-DateRangePickerCalendar_18o3i_218","bui-DateRangePickerCalendarHeader":"_bui-DateRangePickerCalendarHeader_18o3i_223","bui-DateRangePickerCalendarHeading":"_bui-DateRangePickerCalendarHeading_18o3i_230","bui-DateRangePickerCalendarNavButton":"_bui-DateRangePickerCalendarNavButton_18o3i_239","bui-DateRangePickerCalendarGrid":"_bui-DateRangePickerCalendarGrid_18o3i_272","bui-DateRangePickerCalendarHeaderCell":"_bui-DateRangePickerCalendarHeaderCell_18o3i_278","bui-DateRangePickerCalendarCell":"_bui-DateRangePickerCalendarCell_18o3i_296"},te=R()({styles:h,classNames:{root:"bui-DateRangePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),ie=R()({styles:h,classNames:{root:"bui-DateRangePickerGroup",dateFields:"bui-DateRangePickerDateFields",dateInput:"bui-DateRangePickerDateInput",segment:"bui-DateRangePickerSegment",separator:"bui-DateRangePickerSeparator",button:"bui-DateRangePickerButton"},bg:"consumer",propDefs:{}}),se=R()({styles:h,classNames:{root:"bui-DateRangePickerCalendar",header:"bui-DateRangePickerCalendarHeader",heading:"bui-DateRangePickerCalendarHeading",navButton:"bui-DateRangePickerCalendarNavButton",grid:"bui-DateRangePickerCalendarGrid",gridHeader:"bui-DateRangePickerCalendarGridHeader",headerCell:"bui-DateRangePickerCalendarHeaderCell",gridBody:"bui-DateRangePickerCalendarGridBody",cell:"bui-DateRangePickerCalendarCell"},propDefs:{}}),S=({dataSize:r})=>{const{ownProps:a,dataAttributes:s}=y(ie,{}),{classes:t}=a;return e.jsxs(U,{className:t.root,...s,...r?{"data-size":r}:{},children:[e.jsxs("div",{className:t.dateFields,children:[e.jsx(C,{slot:"start",className:t.dateInput,children:o=>e.jsx(j,{segment:o,className:t.segment})}),e.jsx("span",{"aria-hidden":"true",className:t.separator,children:"–"}),e.jsx(C,{slot:"end",className:t.dateInput,children:o=>e.jsx(j,{segment:o,className:t.segment})})]}),e.jsx(P,{className:t.button,"aria-label":"Open calendar",children:e.jsx(Y,{size:16,"aria-hidden":"true"})})]})};S.__docgenInfo={description:`Custom field group for DateRangePicker — renders two DateInput fields,
a separator, and a calendar trigger button.

@internal`,methods:[],displayName:"DateRangePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const B=()=>{const{ownProps:r}=y(se,{}),{classes:a}=r;return e.jsxs(V,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(P,{slot:"previous",className:a.navButton,children:e.jsx(O,{size:16,"aria-hidden":"true"})}),e.jsx(J,{className:a.heading}),e.jsx(P,{slot:"next",className:a.navButton,children:e.jsx(Z,{size:16,"aria-hidden":"true"})})]}),e.jsxs(T,{className:a.grid,children:[e.jsx(q,{className:a.gridHeader,children:s=>e.jsx(H,{className:a.headerCell,children:s})}),e.jsx(G,{className:a.gridBody,children:s=>e.jsx(M,{className:a.cell,date:s})})]})]})};B.__docgenInfo={description:`Calendar popover content for DateRangePicker — renders the RangeCalendar
with navigation and a full calendar grid.

@internal`,methods:[],displayName:"DateRangePickerCalendar"};const n=v.forwardRef((r,a)=>{const{ownProps:s,restProps:t,dataAttributes:o}=y(te,r),{classes:L,label:x,description:F,secondaryLabel:W}=s,$=t["aria-label"],_=t["aria-labelledby"];v.useEffect(()=>{!x&&!$&&!_&&console.warn("DateRangePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[x,$,_]);const z=W||(t.isRequired?"Required":null);return e.jsxs(A,{className:L.root,...o,...t,ref:a,children:[e.jsx(K,{label:x,secondaryLabel:z,description:F,descriptionSlot:"description"}),e.jsx(S,{dataSize:o["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(B,{})})]})});n.displayName="DateRangePicker";n.__docgenInfo={description:`A date range picker that combines two date fields and a calendar popover,
allowing users to enter or select a date range with full keyboard and
screen reader accessibility.

@public`,methods:[],displayName:"DateRangePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date range picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const i=I.meta({title:"Backstage UI/DateRangePicker",component:n,args:{style:{width:360}}}),c=i.story({args:{}}),p=i.story({args:{label:"Date range"}}),u=i.story({args:{label:"Date range",description:"Select a start and end date for your event."}}),m=i.story({args:{label:"Booking period",defaultValue:{start:l("2025-02-03"),end:l("2025-02-14")}}}),g=i.story({args:{label:"Date range"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=i.story({args:{label:"Trip dates",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),D=i.story({args:{label:"Date range",isDisabled:!0,defaultValue:{start:l("2025-03-01"),end:l("2025-03-15")}}}),f=i.story({args:{label:"Date range",isInvalid:!0,errorMessage:"The selected range is not available.",defaultValue:{start:l("2025-04-01"),end:l("2025-04-10")}}}),k=i.story({args:{label:"Date range",description:"You can only select dates within the next 30 days.",minValue:N(w()),maxValue:N(w()).add({days:30})}}),d=i.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable. You cannot select a range that spans across them.",isDateUnavailable:s=>E(s,a)})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'Select a start and end date for your event.'
  }
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Booking period',
    defaultValue: {
      start: parseDate('2025-02-03'),
      end: parseDate('2025-02-14')
    }
  }
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} size="small" label="Small" />
      <DateRangePicker {...args} size="medium" label="Medium" />
    </div>
})`,...g.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Trip dates',
    isRequired: true
  },
  render: args => <Form onSubmit={e => {
    e.preventDefault();
  }} style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
})`,...b.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isDisabled: true,
    defaultValue: {
      start: parseDate('2025-03-01'),
      end: parseDate('2025-03-15')
    }
  }
})`,...D.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isInvalid: true,
    errorMessage: 'The selected range is not available.',
    defaultValue: {
      start: parseDate('2025-04-01'),
      end: parseDate('2025-04-10')
    }
  }
})`,...f.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...k.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DateRangePicker {...args} label="Working days only" description="Weekends are unavailable. You cannot select a range that spans across them." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...d.input.parameters?.docs?.source},description:{story:`Weekends are marked unavailable. Because \`allowsNonContiguousRanges\` is not
set (defaults to false), the picker prevents the user from selecting any
range that spans across an unavailable date — the selection snaps to avoid
crossing a weekend.`,...d.input.parameters?.docs?.description}}};const Ke=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{c as Default,D as Disabled,f as Invalid,b as Required,g as Sizes,m as WithDefaultValue,u as WithDescription,p as WithLabel,k as WithMinMaxValue,d as WithUnavailableDates,Ke as __namedExportsOrder};
