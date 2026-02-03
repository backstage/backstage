import{j as o}from"./iframe-BRAtl1PG.js";import{c as e}from"./plugin-l6zBNSAL.js";import{S as l}from"./Grid-Cneg6dXd.js";import{C as m}from"./ComponentAccordion-CK4paj5w.js";import{w as a}from"./appWrappers-B2HzzFzx.js";import{T as i}from"./TemplateBackstageLogoIcon-CB6jH-6Q.js";import{I as s}from"./InfoCard-Usjt7j2Q.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B8o3244Q.js";import"./componentData-jPNeQwLn.js";import"./useAnalytics-DVsybmfh.js";import"./useApp-Gv1SYk8q.js";import"./useRouteRef-D86Ud85d.js";import"./index-UAXk7FN5.js";import"./DialogTitle-KC0EWpd-.js";import"./Modal-COPte8PF.js";import"./Portal-CmmcMNPo.js";import"./Backdrop-B3YqXUgb.js";import"./Button-BatWjXLp.js";import"./useObservable-DhHSl2gB.js";import"./useIsomorphicLayoutEffect-DAhw2EJx.js";import"./ExpandMore-DRdYJoQu.js";import"./AccordionDetails-DIaxBLag.js";import"./index-B9sM2jn7.js";import"./Collapse-_zQA2_Pp.js";import"./useAsync-ldnaQaod.js";import"./useMountedState-PBRhdOpD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-0Gy7iGeb.js";import"./ErrorBoundary-BxBSIGMP.js";import"./ErrorPanel-YK6XTPJI.js";import"./WarningPanel-Dgi0x69_.js";import"./MarkdownContent-BIfRKm7t.js";import"./CodeSnippet-BYUXS9v0.js";import"./Box-D7EfII4J.js";import"./styled-D-CRs93U.js";import"./CopyTextButton-BPfRPWdE.js";import"./useCopyToClipboard-BuklA7P5.js";import"./Tooltip-CPq4vOtC.js";import"./Popper-b-3H8dnH.js";import"./List-DW5i0QCT.js";import"./ListContext-DnBkigGS.js";import"./ListItem-DGTqNMMt.js";import"./ListItemText-BSrDcH8Z.js";import"./LinkButton-B0gUiM7k.js";import"./Link-BXsEZtUH.js";import"./lodash-Czox7iJy.js";import"./CardHeader-SetS9v0o.js";import"./Divider-BFDiZlO8.js";import"./CardActions-CvfK4yuw.js";import"./BottomLink-B6cNqluB.js";import"./ArrowForward-Cbg0slKz.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
