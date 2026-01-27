import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-D7tLk4ld.js";import{s as g,H as u}from"./plugin-CJeyItKq.js";import{c as h}from"./api-Bm66sEzD.js";import{c as f}from"./catalogApiMock-CJwiFQvT.js";import{s as x}from"./api-BUdgNFzo.js";import{S as y}from"./SearchContext-D-ImOu9Y.js";import{P as S}from"./Page-B9irrruX.js";import{S as r}from"./Grid-DIKn7D0E.js";import{b as k,a as j,c as C}from"./plugin-D0BFLUdw.js";import{T as P}from"./TemplateBackstageLogo-CLrZYfuD.js";import{T}from"./TemplateBackstageLogoIcon-LxFLhcbT.js";import{e as I}from"./routes-CeeecDbd.js";import{w as v}from"./appWrappers-LFN562Aq.js";import{s as G}from"./StarredEntitiesApi-B7CWv2xi.js";import{M as A}from"./MockStarredEntitiesApi-D8GvFdyB.js";import{I as B}from"./InfoCard-v3VrqR1c.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BndmOlo_.js";import"./Plugin-B7Cc_-YL.js";import"./componentData-Dqkdwtuq.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useApp-D_E3IHJo.js";import"./useRouteRef-BfGdJ_eX.js";import"./index-aaT1AT_u.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./DialogTitle-D56g35nD.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./Backdrop-Cyu771p_.js";import"./Button-z5kV09UR.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Ckitt63X.js";import"./ErrorBoundary-DBuFbPsZ.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./ExpandMore-Br1SomQR.js";import"./AccordionDetails-xzn6Vz4b.js";import"./index-B9sM2jn7.js";import"./Collapse-CJcP5srX.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./CopyTextButton-D-7TENHT.js";import"./useCopyToClipboard-DDHvggmk.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./ListItem-bVDpz6Z-.js";import"./ListItemText-DUrf7V-S.js";import"./LinkButton-rPQfynvr.js";import"./Link-B-Kks6_R.js";import"./CardHeader-wKEMhpg-.js";import"./Divider-Dcp5X0Oe.js";import"./CardActions-Bk3RRZ7t.js";import"./BottomLink-CYGivY5K.js";import"./ArrowForward-C-Ay2WeA.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
