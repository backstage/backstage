import{j as t,W as u,K as p,X as g}from"./iframe-D9hL09PA.js";import{r as h}from"./plugin-bvvUif4D.js";import{S as l,u as c,a as x}from"./useSearchModal-DU8aihYn.js";import{s as S,M}from"./api-Dz5P41BF.js";import{S as C}from"./SearchContext-CY3DHMfY.js";import{B as m}from"./Button-CaflJL4D.js";import{m as f}from"./makeStyles-DTQ8SdVn.js";import{D as j,a as y,b as B}from"./DialogTitle-DO3z4xku.js";import{B as D}from"./Box-s6YRe9vN.js";import{S as n}from"./Grid-D6FWqA9h.js";import{S as I}from"./SearchType-ldrZPY0M.js";import{L as G}from"./List-DjRcYuTE.js";import{H as R}from"./DefaultResultListItem-Cq8HuPDV.js";import{w as k}from"./appWrappers-CtVrV938.js";import{SearchBar as v}from"./SearchBar-D-JzqQrX.js";import{S as T}from"./SearchResult-COarAaVx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DoTJ4li4.js";import"./Plugin-CCOZKcau.js";import"./componentData-Bfd1OT-T.js";import"./useAnalytics-CRWiGQGU.js";import"./useApp-BN8fcp1J.js";import"./useRouteRef-DIb6ve3a.js";import"./index-DnevwhiT.js";import"./ArrowForward-DW__eDpF.js";import"./translation-D3exMbsb.js";import"./Page-2AY_JTEV.js";import"./useMediaQuery-CZS8tEgE.js";import"./Divider-DPpr77Ph.js";import"./ArrowBackIos-BNsOdXot.js";import"./ArrowForwardIos-CdFAy8WG.js";import"./translation-9x1g3XFw.js";import"./lodash-C27Rn_8V.js";import"./useAsync-TJX9dgxM.js";import"./useMountedState-H9GYsHLx.js";import"./Modal-B0gOEwSA.js";import"./Portal-IHwjUdnq.js";import"./Backdrop-DicFhym_.js";import"./styled-DyvFt11P.js";import"./ExpandMore-PhPXt6NC.js";import"./AccordionDetails-D6ir3Xxo.js";import"./index-B9sM2jn7.js";import"./Collapse-ubJepro_.js";import"./ListItem-CnqOAGWo.js";import"./ListContext-Brz2Wbg-.js";import"./ListItemIcon-DrYdbKuy.js";import"./ListItemText-T3LZa7Az.js";import"./Tabs-B1a_83Nq.js";import"./KeyboardArrowRight-Bm3GnznI.js";import"./FormLabel-Cwhb_R8o.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-GjSOxKsI.js";import"./InputLabel-CAB57AY0.js";import"./Select-DqbXIOQT.js";import"./Popover-DGQTxlhs.js";import"./MenuItem-DEJs1Jau.js";import"./Checkbox-BMbsU_E2.js";import"./SwitchBase-CxNWLf1X.js";import"./Chip-Bo1kMf3x.js";import"./Link-Dki0Wf5B.js";import"./index-CtgFInvS.js";import"./useObservable-CD7r_r4r.js";import"./useIsomorphicLayoutEffect-Buxi1ImV.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search--Uz6WWnR.js";import"./useDebounce-DRdZkCQa.js";import"./InputAdornment-Bwl2eafv.js";import"./TextField-DG2V3zhS.js";import"./useElementFilter-HFBrR3x0.js";import"./EmptyState-KO_nie3T.js";import"./Progress-B3Yr1V2H.js";import"./LinearProgress-BeNqJmbr.js";import"./ResponseErrorPanel-CSeQtz5r.js";import"./ErrorPanel-CCzawTW6.js";import"./WarningPanel-CLBpjv7W.js";import"./MarkdownContent-DdUfmt6L.js";import"./CodeSnippet-D0eKICag.js";import"./CopyTextButton-7z9vx-XI.js";import"./useCopyToClipboard-BDm-mC7V.js";import"./Tooltip-CMB05q-q.js";import"./Popper-DOEiwjSs.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
