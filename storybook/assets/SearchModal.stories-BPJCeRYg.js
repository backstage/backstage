import{j as t,W as u,K as p,X as g}from"./iframe-CIst4AKw.js";import{r as h}from"./plugin-DHOjL3Ts.js";import{S as l,u as c,a as x}from"./useSearchModal-ClC7ntAh.js";import{s as S,M}from"./api-DVNBq7Bo.js";import{S as C}from"./SearchContext-BCzmdF93.js";import{B as m}from"./Button-aHyunA9c.js";import{m as f}from"./makeStyles-CyiKs3qI.js";import{D as j,a as y,b as B}from"./DialogTitle-40VfIzAb.js";import{B as D}from"./Box-bOt6Vm_d.js";import{S as n}from"./Grid-DSn-A5sL.js";import{S as I}from"./SearchType-DFlM7x97.js";import{L as G}from"./List-xkDrwxCe.js";import{H as R}from"./DefaultResultListItem-CvCGAOaP.js";import{w as k}from"./appWrappers-BBP4WbIW.js";import{SearchBar as v}from"./SearchBar-DD8E4zEL.js";import{S as T}from"./SearchResult-CYxkU3tX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CLOsDHan.js";import"./Plugin-CGVNTc2X.js";import"./componentData-BqNProuq.js";import"./useAnalytics-B1Tkmcph.js";import"./useApp-Bg0Bzijx.js";import"./useRouteRef-DUJioYk8.js";import"./index-DTrbkxL5.js";import"./ArrowForward-DOX42sja.js";import"./translation-D7Hmmuun.js";import"./Page-BEwpqa_h.js";import"./useMediaQuery-BReJxXVj.js";import"./Divider-TqV_o75H.js";import"./ArrowBackIos-DqptciEx.js";import"./ArrowForwardIos-CDBhbdcR.js";import"./translation-D6rmNZid.js";import"./lodash-Bv_R2aXJ.js";import"./useAsync-BvZy7Xi8.js";import"./useMountedState-DqqbXNe-.js";import"./Modal-CA5IMXbx.js";import"./Portal-CKExw2or.js";import"./Backdrop-B5CuE-ro.js";import"./styled-BTP3bkaJ.js";import"./ExpandMore-DDyKCygW.js";import"./AccordionDetails-BVXzfQoI.js";import"./index-B9sM2jn7.js";import"./Collapse-ClxFdAvN.js";import"./ListItem-DzW8sEcw.js";import"./ListContext-CV9XkK9z.js";import"./ListItemIcon-BvUI2bIc.js";import"./ListItemText-D8ywHulE.js";import"./Tabs-BCqZjSgX.js";import"./KeyboardArrowRight-CZU0Tl5E.js";import"./FormLabel-D0f18lkM.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-l0L0zmB2.js";import"./InputLabel-Bi6y_Qm5.js";import"./Select-Du7sYOy7.js";import"./Popover-CR_JCiVv.js";import"./MenuItem-BiSATRo7.js";import"./Checkbox-BxBlnKT8.js";import"./SwitchBase-9JUNeZnt.js";import"./Chip-D8cPy6t2.js";import"./Link-Brm3t_Ck.js";import"./index-BKxkX0e4.js";import"./useObservable-0yZqwCBc.js";import"./useIsomorphicLayoutEffect-BvUak_NZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-COlMG0o9.js";import"./useDebounce-Co-MoiGh.js";import"./InputAdornment-BoQm-I9Z.js";import"./TextField-C1JMyuz5.js";import"./useElementFilter-dteaofyB.js";import"./EmptyState-CQxmrLxx.js";import"./Progress-DBhdiNZk.js";import"./LinearProgress-Bik0k9ur.js";import"./ResponseErrorPanel-nmRj4Hs7.js";import"./ErrorPanel-CSLFCz79.js";import"./WarningPanel-DRyT3bmw.js";import"./MarkdownContent-sxVUvLR7.js";import"./CodeSnippet-DrKLKQZ9.js";import"./CopyTextButton-BbIPK9qT.js";import"./useCopyToClipboard-D-RPhu7o.js";import"./Tooltip-BXoJmvrU.js";import"./Popper-B5gGl_yS.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
