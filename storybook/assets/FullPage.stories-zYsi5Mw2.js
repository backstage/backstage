import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-Bbqeoxyy.js";import{P as l}from"./PluginHeader-KzPFAPwg.js";import{C as p}from"./Container-Behc4q__.js";import{T as t}from"./Text-BlehBH3s.js";import{B as j}from"./BUIProvider-BFo_P3jr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CWg0XmG9.js";import"./utils-DuG_PdhV.js";import"./useObjectRef-Cou_yZVk.js";import"./useCollection--fJtGRLb.js";import"./useFocusRing-CJyvvUb2.js";import"./openLink-DSranXhD.js";import"./Hidden-wfkm4vEc.js";import"./keyboard-OW3LSnFF.js";import"./FocusScope-BLvIp10Q.js";import"./useEvent-DXCHZ6eW.js";import"./I18nProvider-o7BfuMCW.js";import"./usePress-DupziYu-.js";import"./textSelection-CSZvk6XP.js";import"./useControlledState-Dwmvm7Z8.js";import"./Link-Atx-Phjx.js";import"./useLink-BpnDc6HE.js";import"./useHover-8JiRj4U9.js";import"./useLocalizedStringFormatter-Cp3K2lsu.js";import"./Button-DBxI9neY.js";import"./Label-BYZanQTo.js";import"./useLabel-CueqYSAw.js";import"./useLabels-CD6Jijpq.js";import"./number-B0As9b-E.js";import"./useButton-CP9W9vY-.js";import"./Menu-CxV_Hy7D.js";import"./Autocomplete-DejFa75s.js";import"./getItemCount-CqqnBPvL.js";import"./Input-nC1ndIv_.js";import"./ListBox-Yv13f5-s.js";import"./Text-Cr5ym0oi.js";import"./useListState-DXn2kpOz.js";import"./Dialog-BbliGjQD.js";import"./Heading-B9aI8xvX.js";import"./useOverlayTriggerState-WXzfO5cP.js";import"./VisuallyHidden-BOk9nD-m.js";import"./animation-UzooCWZq.js";import"./SearchField-CWgaa0Wk.js";import"./FieldError-BDQ8zAVN.js";import"./useFormValidation-Cw1sohsz.js";import"./useTextField-WT6ToGrz.js";import"./useField-eNfnIoXm.js";import"./useFormReset-JrSj1kIr.js";import"./Virtualizer-B8wSazTV.js";import"./useFilter-6_lgTKlj.js";import"./getNodeText-egjXunqn.js";import"./Link-DP9X4t94.js";import"./useResolvedHref-Bglto435.js";import"./Tooltip-CFwX76yy.js";import"./VisuallyHidden-CssV_T1u.js";import"./Tabs-j4XWZCKq.js";import"./useHasTabbableChild-CGCtYb7z.js";import"./BUIRoutingProvider-DBaglhBD.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
