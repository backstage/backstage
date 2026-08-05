import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-CMKJKLUT.js";import{P as l}from"./PluginHeader-7Pv0BJU4.js";import{C as p}from"./Container-CEqgbsou.js";import{T as t}from"./Text-D2qZCCV6.js";import{B as j}from"./BUIProvider-DkcvuMdl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DmjMZt5B.js";import"./utils-CvvRR5aT.js";import"./useObjectRef-BuVj0MY8.js";import"./useCollection-DnirdA6W.js";import"./useFocusRing-BsrOlbwX.js";import"./openLink-CuYP7gPT.js";import"./Hidden-yy8u865W.js";import"./keyboard-C7TJsoqE.js";import"./FocusScope-BAx5CJlC.js";import"./useEvent-CYmdv-XJ.js";import"./I18nProvider-DNttPEDV.js";import"./usePress-SWIST_DD.js";import"./textSelection-BBT3_o9i.js";import"./useControlledState-v_oGfpQe.js";import"./Link-Cx6-nnW0.js";import"./useLink-DeOEijnZ.js";import"./useHover-b_v_F8vi.js";import"./useLocalizedStringFormatter-DjHS54sp.js";import"./Button-D2707XjA.js";import"./Label-CdTMbHUG.js";import"./useLabel-DYjQeQ13.js";import"./useLabels-s9NhyS06.js";import"./number-BK7i31-5.js";import"./useButton-BBt4i9aT.js";import"./Menu-DYTPMyFz.js";import"./Autocomplete-CmhvEYa5.js";import"./getItemCount-BYLt-gyB.js";import"./Input-D5Dwk_-N.js";import"./ListBox-DnkwV13n.js";import"./Text-EDMS0XYX.js";import"./useListState-Dtk8K3I1.js";import"./Dialog-D6nw_yaU.js";import"./Heading-CLjI2QkE.js";import"./useOverlayTriggerState-gM5yelRW.js";import"./VisuallyHidden-oIRCnDsR.js";import"./animation-UqwXZAR_.js";import"./SearchField-Cwt4HmzI.js";import"./FieldError-CCF7VJYp.js";import"./useFormValidation-B_x2cwZk.js";import"./useTextField-BCVN-mBu.js";import"./useField-DLP5oS0R.js";import"./useFormReset-DrwEtMky.js";import"./Virtualizer-aSdwmjgE.js";import"./useFilter-Cd5gPxES.js";import"./getNodeText-BDrsuRRw.js";import"./Link-BVxL_CoZ.js";import"./useResolvedHref-BMahjBhp.js";import"./Tooltip-DNowRtwz.js";import"./VisuallyHidden-C0lUScXh.js";import"./Tabs-CkFkIz4C.js";import"./useHasTabbableChild-wE-J6O7D.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
