import{j as o}from"./iframe-D7tLk4ld.js";import{c as e}from"./plugin-D0BFLUdw.js";import{S as l}from"./Grid-DIKn7D0E.js";import{C as m}from"./ComponentAccordion-D2-mx0xk.js";import{w as a}from"./appWrappers-LFN562Aq.js";import{T as i}from"./TemplateBackstageLogoIcon-LxFLhcbT.js";import{I as s}from"./InfoCard-v3VrqR1c.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B7Cc_-YL.js";import"./componentData-Dqkdwtuq.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./useRouteRef-BfGdJ_eX.js";import"./index-aaT1AT_u.js";import"./DialogTitle-D56g35nD.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./Backdrop-Cyu771p_.js";import"./Button-z5kV09UR.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./ExpandMore-Br1SomQR.js";import"./AccordionDetails-xzn6Vz4b.js";import"./index-B9sM2jn7.js";import"./Collapse-CJcP5srX.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Ckitt63X.js";import"./ErrorBoundary-DBuFbPsZ.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./CopyTextButton-D-7TENHT.js";import"./useCopyToClipboard-DDHvggmk.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./ListItemText-DUrf7V-S.js";import"./LinkButton-rPQfynvr.js";import"./Link-B-Kks6_R.js";import"./lodash-Czox7iJy.js";import"./CardHeader-wKEMhpg-.js";import"./Divider-Dcp5X0Oe.js";import"./CardActions-Bk3RRZ7t.js";import"./BottomLink-CYGivY5K.js";import"./ArrowForward-C-Ay2WeA.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
