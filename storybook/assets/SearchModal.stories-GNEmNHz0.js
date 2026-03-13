import{j as t,W as u,K as p,X as g}from"./iframe-C-coJuUP.js";import{r as h}from"./plugin-CdHTYWzX.js";import{S as l,u as c,a as x}from"./useSearchModal-BUvLDp_u.js";import{s as S,M}from"./api-ssQ3Qj5i.js";import{S as C}from"./SearchContext-BJ7fTOh-.js";import{B as m}from"./Button-BsFcYRf2.js";import{m as f}from"./makeStyles-CiHm2TPH.js";import{D as j,a as y,b as B}from"./DialogTitle-CBj3zL_R.js";import{B as D}from"./Box-DUptaEM1.js";import{S as n}from"./Grid-CpuCkwO3.js";import{S as I}from"./SearchType-BkwXD4Yx.js";import{L as G}from"./List-DmNK4dvp.js";import{H as R}from"./DefaultResultListItem-ow4lXgC0.js";import{w as k}from"./appWrappers-CdioH-jm.js";import{SearchBar as v}from"./SearchBar-Bo995Ftg.js";import{S as T}from"./SearchResult-CLHFI7vj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CK7yCOkR.js";import"./Plugin-BxEyHIzf.js";import"./componentData-CAUcuYKY.js";import"./useAnalytics-Csq2_frD.js";import"./useApp-DwifVUVc.js";import"./useRouteRef-CNiCqjpw.js";import"./index-2anb1mQB.js";import"./ArrowForward-CqNKVOqz.js";import"./translation-DMh-Umb5.js";import"./Page-CXnO-5zE.js";import"./useMediaQuery-BzWp8RXW.js";import"./Divider-DFcxU8OS.js";import"./ArrowBackIos-CO9_MA1l.js";import"./ArrowForwardIos-CrO6DbrF.js";import"./translation-BVt3Odwo.js";import"./lodash-BMGFMZfQ.js";import"./useAsync-DVqxPCgr.js";import"./useMountedState-BzctEBb5.js";import"./Modal-CU7kgWSP.js";import"./Portal-7MVcqHay.js";import"./Backdrop-gwjQ7AiJ.js";import"./styled-a3UFYgpT.js";import"./ExpandMore-ksCX5CD2.js";import"./AccordionDetails-B8tR2uC9.js";import"./index-B9sM2jn7.js";import"./Collapse-fbo-cbCX.js";import"./ListItem-B38saMSF.js";import"./ListContext-DK0SRiIG.js";import"./ListItemIcon-DoUmQqZo.js";import"./ListItemText-C0-H0C9-.js";import"./Tabs-Ca-ndktB.js";import"./KeyboardArrowRight-CIJ2dEN3.js";import"./FormLabel-DmTRdOsG.js";import"./formControlState-DabV58J4.js";import"./InputLabel-DhMB8FIr.js";import"./Select-Dhmfb78L.js";import"./Popover-D_ta6ggJ.js";import"./MenuItem-Si0fbldX.js";import"./Checkbox-D9gVmyzI.js";import"./SwitchBase-4KqYGerE.js";import"./Chip-D6I2j8-7.js";import"./Link-BAqVydJ4.js";import"./index-CBdKPl6K.js";import"./useObservable-CtHErxE2.js";import"./useIsomorphicLayoutEffect-BgJo-eyS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DRBIQeJG.js";import"./useDebounce-f31Hmgu0.js";import"./InputAdornment-D3kjfZv6.js";import"./TextField-Bj1uwv43.js";import"./useElementFilter-DWuPvzaP.js";import"./EmptyState-DR9Us5F4.js";import"./Progress-Dll2-_A2.js";import"./LinearProgress-gxPwbSNk.js";import"./ResponseErrorPanel-DZd_3eE8.js";import"./ErrorPanel-8ak56BOi.js";import"./WarningPanel-kT6KQz6k.js";import"./MarkdownContent-8VuNV2bl.js";import"./CodeSnippet-CQdXrMO3.js";import"./CopyTextButton-BysfE0zg.js";import"./useCopyToClipboard-CtKTY1lC.js";import"./Tooltip-DiFwxGBu.js";import"./Popper-dI_EnRqc.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
