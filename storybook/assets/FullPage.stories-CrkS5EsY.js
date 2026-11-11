import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-C7lYm63e.js";import{T as y}from"./TestRouter-DYk_Fmku.js";import{P as l}from"./PluginHeader-Df5XZij-.js";import{C as p}from"./Container-Cv2SowcF.js";import{T as t}from"./Text-hWRyQHsT.js";import{B as j}from"./BUIProvider-uNuGl61A.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FJv8Tr6k.js";import"./index-YLMOL70x.js";import"./utils-BUzKzuKz.js";import"./useObjectRef-aANnWHv4.js";import"./useCollection-DWXA0qb2.js";import"./useFocusRing-DBYmBdNX.js";import"./Hidden-C01qEBuY.js";import"./keyboard-COdNUR9C.js";import"./getMetaValue-C1Arjnva.js";import"./FocusScope-CQmsnwev.js";import"./useEvent-Bz_EWePK.js";import"./I18nProvider-cMES1Ye-.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./useControlledState-BNzUk4rc.js";import"./Link-yEPv1lMU.js";import"./useLink-CvF7_JEa.js";import"./useHover-Dh_5CIee.js";import"./useLocalizedStringFormatter-YAhVtzvN.js";import"./Button-9cVhP8ym.js";import"./Label-BN9dytpW.js";import"./useLabel-CLnEY2ws.js";import"./useLabels-B_JIZiXA.js";import"./number-Ctxb0h4T.js";import"./useButton-DYcDcyWL.js";import"./Menu-DydXDPWP.js";import"./Autocomplete-nYZs8amC.js";import"./useLoadMoreSentinel-DH8UKFQx.js";import"./Input-Bl4PdeGR.js";import"./ListBox-DHywnJr5.js";import"./SelectionIndicator-DMtbktx0.js";import"./Text-BaJbPGan.js";import"./useListState-BKK6D36b.js";import"./Dialog-CNfDll7A.js";import"./Heading-DFG6W8uO.js";import"./useOverlayTriggerState-BmV-E52M.js";import"./VisuallyHidden-H9cJaS2-.js";import"./animation-DANnDqD6.js";import"./SearchField-Bnn9KBeb.js";import"./FieldError-DSs23qmd.js";import"./Form-zZEEHrPM.js";import"./useFormValidation-DUls_W6A.js";import"./useTextField-7X0JhYHF.js";import"./useField-k9YTPZiv.js";import"./useFormReset-BEQYUo_O.js";import"./Virtualizer-D4okNkb5.js";import"./useFilter-BMWcoDs4.js";import"./getNodeText-DRW1iLZn.js";import"./BUIRoutingProvider-BQOAZjhP.js";import"./Link-KupkmhiB.js";import"./Tooltip-BcqrA52i.js";import"./VisuallyHidden-DQskGtoQ.js";import"./Tabs-DGSOKkn8.js";import"./useHasTabbableChild-DD7I8snX.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
