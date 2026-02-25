import{j as t,W as u,K as p,X as g}from"./iframe-DcAecAau.js";import{r as h}from"./plugin-D4_DD9s9.js";import{S as l,u as c,a as x}from"./useSearchModal-vRu1ndAi.js";import{s as S,M}from"./api-GaFvy9o-.js";import{S as C}from"./SearchContext-S5QDRRlJ.js";import{B as m}from"./Button-BaP21Y2H.js";import{m as f}from"./makeStyles-Cdr7b8Bk.js";import{D as j,a as y,b as B}from"./DialogTitle-CLkoavD3.js";import{B as D}from"./Box-DFVASWD2.js";import{S as n}from"./Grid-DVeyPTP6.js";import{S as I}from"./SearchType-CvR-84RO.js";import{L as G}from"./List-DwRDgM_u.js";import{H as R}from"./DefaultResultListItem-V1hA29S2.js";import{w as k}from"./appWrappers-adu5cj2R.js";import{SearchBar as v}from"./SearchBar-trCCgtof.js";import{S as T}from"./SearchResult-Cj77aDJ3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_in6OtC.js";import"./Plugin-BGHfKivX.js";import"./componentData-BsN32ToI.js";import"./useAnalytics-DH1T3srq.js";import"./useApp-wY_LWfHh.js";import"./useRouteRef-Bhs9MXSy.js";import"./index-CNtntR7q.js";import"./ArrowForward--Fm_6Bi4.js";import"./translation-B593Wtgj.js";import"./Page-CIQeyu4d.js";import"./useMediaQuery-x-DuVaS-.js";import"./Divider-DBnD1KTp.js";import"./ArrowBackIos-CNdzpL7C.js";import"./ArrowForwardIos-CieGjieB.js";import"./translation-DlOJ0j8g.js";import"./lodash-EmQGSg9i.js";import"./useAsync-Caf5A2Bw.js";import"./useMountedState-CQNruCwR.js";import"./Modal-CU8nMOSv.js";import"./Portal-DUiXLT2Z.js";import"./Backdrop-Cu3ebA_D.js";import"./styled-24VWDP1y.js";import"./ExpandMore-Bv6wh0Jn.js";import"./AccordionDetails-CFArFB8R.js";import"./index-B9sM2jn7.js";import"./Collapse-LuntTC0U.js";import"./ListItem-Dm4rReYJ.js";import"./ListContext-D1z8ROX7.js";import"./ListItemIcon-C9SpAL9q.js";import"./ListItemText-ByqOJbY1.js";import"./Tabs-B1niHVof.js";import"./KeyboardArrowRight-BXPL758x.js";import"./FormLabel-BdHanWrv.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B8HfUmjU.js";import"./InputLabel-DXPDZuK-.js";import"./Select-B5Y9RXqo.js";import"./Popover-8B15LdLG.js";import"./MenuItem-By57BI4l.js";import"./Checkbox-BGqBvG6i.js";import"./SwitchBase-DKK3IAMv.js";import"./Chip-BLcfzlrM.js";import"./Link-CveV8ncC.js";import"./index-B8zE_pAT.js";import"./useObservable-CCLSm_z5.js";import"./useIsomorphicLayoutEffect-BrQ2srDd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-B8iiHUN2.js";import"./useDebounce-BmF91E0G.js";import"./InputAdornment-ByUp_ScB.js";import"./TextField-RyplE8h3.js";import"./useElementFilter-BKSIM3-B.js";import"./EmptyState-GqSmfJAE.js";import"./Progress-2zZY9kDp.js";import"./LinearProgress-Bsa7eTqT.js";import"./ResponseErrorPanel-Dyfik0_b.js";import"./ErrorPanel-DqTa6nhJ.js";import"./WarningPanel-D-CK0fsi.js";import"./MarkdownContent-Bi-O3WwF.js";import"./CodeSnippet-DugLxyH3.js";import"./CopyTextButton-BZgvs1hH.js";import"./useCopyToClipboard-B681kdeU.js";import"./Tooltip--unGCy0g.js";import"./Popper-CfVmlnqD.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
