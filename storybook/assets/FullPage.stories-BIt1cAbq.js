import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-BiC6vzfc.js";import{P as l}from"./PluginHeader-DjSmL6bD.js";import{C as p}from"./Container-CEg17JrZ.js";import{T as t}from"./Text-DfVerI7c.js";import{B as j}from"./BUIProvider-DEMxJ951.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BGy42kW1.js";import"./utils-BQPJ15nW.js";import"./useObjectRef-rJAA83qf.js";import"./useCollection-B42IhdHb.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./Hidden-DdtniuZ_.js";import"./keyboard-D5DMZ6gP.js";import"./FocusScope-wenHxxG1.js";import"./useEvent-Dd_RM8Os.js";import"./I18nProvider-DJaDCNar.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./useControlledState-CjMsoNHV.js";import"./Link-BxM_H5UN.js";import"./useLink-C_UAK_Mo.js";import"./useHover-CRtjWjkD.js";import"./useLocalizedStringFormatter-D_kpWZGR.js";import"./Button-CSCohGDT.js";import"./Label-Dt81RO29.js";import"./useLabel-CfyoKpiQ.js";import"./useLabels-Kk8q7j9x.js";import"./number-CQJyNM_c.js";import"./useButton-EPm5NcFx.js";import"./Menu-B2vKiAoa.js";import"./Autocomplete-L6wt6zc3.js";import"./getItemCount-DeU0FbhD.js";import"./Input-BvY9P7oi.js";import"./ListBox-BPNtzyPA.js";import"./Text-DJ4PbFTT.js";import"./useListState-PwbmWUAf.js";import"./Dialog-C1cXOchU.js";import"./Heading-VJFmb6mV.js";import"./useOverlayTriggerState-CjTLIV8R.js";import"./VisuallyHidden-DwJsbRnS.js";import"./animation-89PtgvT4.js";import"./SearchField-CIaKxxPD.js";import"./FieldError-BQCqgleQ.js";import"./useFormValidation-D7qN8pdJ.js";import"./useTextField-sAn9ne3h.js";import"./useField-BK37-c9c.js";import"./useFormReset-Cq9Z1B3A.js";import"./Virtualizer-DtVE7joR.js";import"./useFilter-BT9flZnW.js";import"./getNodeText-9xFtoTWr.js";import"./Link-00Raw4XY.js";import"./useResolvedHref-G7FW9UOs.js";import"./Tooltip-B5bHPnfj.js";import"./VisuallyHidden-CGljxK2G.js";import"./Tabs-BQqyuaGO.js";import"./useHasTabbableChild-BKpnwopv.js";import"./BUIRoutingProvider-ht1fdH5F.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
