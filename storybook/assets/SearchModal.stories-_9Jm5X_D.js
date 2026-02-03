import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DCoYcZLi.js";import{r as x}from"./plugin-BR36UYxA.js";import{S as l,u as c,a as S}from"./useSearchModal-WCeqkZq8.js";import{s as M,M as C}from"./api-CtEo9Teb.js";import{S as f}from"./SearchContext-COprA1mB.js";import{B as m}from"./Button-Cp5oCkaD.js";import{D as j,a as y,b as B}from"./DialogTitle-CfF7TlGp.js";import{B as D}from"./Box-DX2D8BTJ.js";import{S as n}from"./Grid-D58TNpxw.js";import{S as I}from"./SearchType-CvFmfjlb.js";import{L as G}from"./List-BdybXaA2.js";import{H as R}from"./DefaultResultListItem-sTTKL61C.js";import{w as k}from"./appWrappers-bScNmkAy.js";import{SearchBar as v}from"./SearchBar-23Gyenti.js";import{S as T}from"./SearchResult-C6YgyMx1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CXqAb5g3.js";import"./Plugin-CPv3ynDX.js";import"./componentData-OraWGl32.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./useRouteRef-D7QjhLBn.js";import"./index-CZ9gZJRb.js";import"./ArrowForward-BR9xJcBP.js";import"./translation-BVOHTvUk.js";import"./Page-D_P_LqWs.js";import"./useMediaQuery-CRNXQ6HN.js";import"./Divider-Ca-0TjsJ.js";import"./ArrowBackIos-Cq4ShzZb.js";import"./ArrowForwardIos-CEAonPfR.js";import"./translation-D0_H8PeL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BaVFaK6n.js";import"./useMountedState-CnGoVtA3.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./Backdrop-BzZC6sIJ.js";import"./styled-h2gldWYB.js";import"./ExpandMore-BjerwzBY.js";import"./AccordionDetails-D0-Ip2Ry.js";import"./index-B9sM2jn7.js";import"./Collapse-K2usbj1G.js";import"./ListItem-DlFYWpXw.js";import"./ListContext-DkVKA3j4.js";import"./ListItemIcon-EJVljSKW.js";import"./ListItemText-BwT95NDX.js";import"./Tabs-ifjWCLLT.js";import"./KeyboardArrowRight-tLZpyZGw.js";import"./FormLabel-TH7L9HeH.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DwmME2Xd.js";import"./InputLabel-ytmnoEQX.js";import"./Select-PZxOyHgK.js";import"./Popover-D-wzkU98.js";import"./MenuItem-BG4xNoZn.js";import"./Checkbox-LQprqb9U.js";import"./SwitchBase-BhdW6CAo.js";import"./Chip-p0TRd8VE.js";import"./Link-BB_0S9nF.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CO2SgLFA.js";import"./useDebounce-BJ8mvT7r.js";import"./InputAdornment-BaR4Gn_i.js";import"./TextField-islGd63O.js";import"./useElementFilter-Cp5g2DVG.js";import"./EmptyState-CNsOU4bs.js";import"./Progress-CwT5NykT.js";import"./LinearProgress-D7xeDy9T.js";import"./ResponseErrorPanel-80X7M4I-.js";import"./ErrorPanel-D9pajOJW.js";import"./WarningPanel-2R8Y_I4d.js";import"./MarkdownContent-B24-9cF1.js";import"./CodeSnippet-BoQ2ohjZ.js";import"./CopyTextButton-Crh7sKVk.js";import"./useCopyToClipboard-Ceo0QToL.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
